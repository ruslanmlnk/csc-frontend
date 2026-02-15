import React, { Fragment } from 'react'
import Banner from '../Banner'

interface LexicalNode {
    type: string
    children?: LexicalNode[]
    text?: string
    format?: number
    detail?: number
    mode?: string
    style?: string
    tag?: string
    listType?: string
    url?: string
    level?: number
    fields?: {
        [key: string]: unknown
    }
}

interface RichTextProps {
    content: unknown
    className?: string
    bannerSrc?: string
    bannerAlt?: string
    backendUrl?: string
}

const BANNER_MARKER_REGEX = /\[\[BANNER(?::([^\]]+))?\]\]/
const DEFAULT_BANNER_SRC = '/images/latest-posts-bottom-banner.png'

type BannerTokenPart =
    | {
        type: 'text'
        value: string
    }
    | {
        type: 'banner'
        src?: string
    }

type RichTextContent = {
    root?: {
        children?: LexicalNode[]
    }
}

type BannerDoc = {
    caption?: string | null
    image?:
    | number
    | string
    | {
        url?: string | null
    }
    | null
}

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const withBackendUrl = (url: string | undefined, backendUrl: string | undefined): string | undefined => {
    if (!url) return undefined
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (!backendUrl) return url

    return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const getBannerFromRelation = (relation: unknown): { src?: string; alt?: string } | null => {
    if (!relation) {
        return null
    }

    let value: unknown = relation
    if (isObject(relation) && 'value' in relation) {
        value = relation.value
    }

    if (!isObject(value)) {
        return null
    }

    const bannerDoc = value as BannerDoc
    const alt = typeof bannerDoc.caption === 'string' && bannerDoc.caption.length > 0
        ? bannerDoc.caption
        : undefined

    if (typeof bannerDoc.image === 'string') {
        return { src: bannerDoc.image, alt }
    }

    if (isObject(bannerDoc.image) && typeof bannerDoc.image.url === 'string') {
        return { src: bannerDoc.image.url, alt }
    }

    return { alt }
}

const isRichTextContent = (value: unknown): value is RichTextContent => {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const maybeContent = value as RichTextContent
    return typeof maybeContent.root === 'object'
}

const splitTextByBannerMarkers = (text: string): BannerTokenPart[] => {
    const parts: BannerTokenPart[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    const regex = /\[\[BANNER(?::([^\]]+))?\]\]/g
    while ((match = regex.exec(text)) !== null) {
        const before = text.slice(lastIndex, match.index)
        if (before.length > 0) {
            parts.push({ type: 'text', value: before })
        }

        const inlineSrc = match[1]?.trim()
        parts.push({
            type: 'banner',
            src: inlineSrc && inlineSrc.length > 0 ? inlineSrc : undefined,
        })

        lastIndex = match.index + match[0].length
    }

    const rest = text.slice(lastIndex)
    if (rest.length > 0 || parts.length === 0) {
        parts.push({ type: 'text', value: rest })
    }

    return parts
}

const RichText: React.FC<RichTextProps> = ({
    content,
    className,
    bannerSrc = DEFAULT_BANNER_SRC,
    bannerAlt = 'Banner',
    backendUrl,
}) => {
    if (!isRichTextContent(content) || !content.root || !content.root.children) {
        return null
    }

    const renderTextNode = (text: string | undefined, format: number | undefined, key: string) => {
        const value = text ?? ''
        let rendered: React.ReactNode = value

        if (format && (format & 16)) {
            rendered = <code>{rendered}</code>
        }
        if (format && (format & 8)) {
            rendered = <span style={{ textDecoration: 'underline' }}>{rendered}</span>
        }
        if (format && (format & 4)) {
            rendered = <span style={{ textDecoration: 'line-through' }}>{rendered}</span>
        }
        if (format && (format & 2)) {
            rendered = <em>{rendered}</em>
        }
        if (format && (format & 1)) {
            rendered = <strong>{rendered}</strong>
        }

        return <Fragment key={key}>{rendered}</Fragment>
    }

    const renderParagraphWithBannerMarkers = (children: LexicalNode[], parentIndex: number) => {
        const paragraphText = children
            .filter((child) => child.type === 'text')
            .map((child) => child.text || '')
            .join('')

        if (!BANNER_MARKER_REGEX.test(paragraphText)) {
            return null
        }

        const blocks: React.ReactNode[] = []
        let paragraphParts: React.ReactNode[] = []
        let hasBanner = false

        const pushParagraph = (keySuffix: string) => {
            if (paragraphParts.length === 0) {
                return
            }

            blocks.push(
                <p key={`${parentIndex}-text-${keySuffix}`} className="mb-4">
                    {paragraphParts}
                </p>,
            )
            paragraphParts = []
        }

        children.forEach((child, childIndex) => {
            if (child.type !== 'text') {
                paragraphParts.push(
                    <Fragment key={`${parentIndex}-non-text-${childIndex}`}>{renderNodes([child])}</Fragment>,
                )
                return
            }

            const parts = splitTextByBannerMarkers(child.text || '')
            parts.forEach((part, partIndex) => {
                if (part.type === 'text') {
                    if (part.value.length > 0) {
                        paragraphParts.push(
                            renderTextNode(part.value, child.format, `${parentIndex}-text-${childIndex}-${partIndex}`),
                        )
                    }
                    return
                }

                hasBanner = true
                pushParagraph(`${childIndex}-${partIndex}`)
                blocks.push(
                    <div key={`${parentIndex}-banner-${childIndex}-${partIndex}`} className="my-8">
                        <Banner src={part.src || bannerSrc} alt={bannerAlt} />
                    </div>,
                )
            })
        })

        pushParagraph('rest')

        if (!hasBanner) {
            return null
        }

        return <Fragment key={parentIndex}>{blocks}</Fragment>
    }

    const renderNodes = (nodes: LexicalNode[]) => {
        return nodes.map((node, index) => {
            switch (node.type) {
                case 'paragraph':
                    if (node.children) {
                        const parsedParagraph = renderParagraphWithBannerMarkers(node.children, index)
                        if (parsedParagraph) {
                            return parsedParagraph
                        }
                    }
                    return (
                        <p key={index} className="mb-4 last:mb-0">
                            {node.children ? renderNodes(node.children) : null}
                        </p>
                    )
                case 'text':
                    return renderTextNode(node.text, node.format, `text-${index}`)
                case 'heading':
                    const HeadingTag = `h${node.level || 1}` as keyof React.JSX.IntrinsicElements
                    return (
                        <HeadingTag key={index} className="font-bold my-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#999]">
                            {node.children ? renderNodes(node.children) : null}
                        </HeadingTag>
                    )
                case 'list':
                    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
                    return (
                        <ListTag key={index} className={`list-inside my-4 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
                            {node.children ? renderNodes(node.children) : null}
                        </ListTag>
                    )
                case 'listitem':
                    return (
                        <li key={index} className="mb-2">
                            {node.children ? renderNodes(node.children) : null}
                        </li>
                    )
                case 'link':
                    return (
                        <a key={index} href={node.url} target="_blank" rel="noopener noreferrer" className="text-[#F29F04] hover:underline">
                            {node.children ? renderNodes(node.children) : null}
                        </a>
                    )
                case 'quote':
                    return (
                        <blockquote key={index} className="border-l-4 border-[#F29F04] pl-4 my-6 italic text-[#FCFCFC]">
                            {node.children ? renderNodes(node.children) : null}
                        </blockquote>
                    )
                case 'block':
                    if (node.fields?.blockType === 'banner') {
                        const bannerFromRelation = getBannerFromRelation(node.fields.banner)
                        const relationSrc = withBackendUrl(bannerFromRelation?.src, backendUrl)
                        const customSrc = typeof node.fields.src === 'string' && node.fields.src.length > 0
                            ? node.fields.src
                            : undefined
                        const blockSrc = relationSrc || customSrc || bannerSrc
                        const blockAlt = bannerFromRelation?.alt
                            || (typeof node.fields.alt === 'string' && node.fields.alt.length > 0 ? node.fields.alt : undefined)
                            || bannerAlt

                        return (
                            <div key={index} className="my-8">
                                <Banner src={blockSrc} alt={blockAlt} />
                            </div>
                        )
                    }
                    return null
                default:
                    return node.children ? <Fragment key={index}>{renderNodes(node.children)}</Fragment> : null
            }
        })
    }

    return (
        <div className={`rich-text ${className || ''}`}>
            {renderNodes(content.root.children)}
        </div>
    )
}

export default RichText
