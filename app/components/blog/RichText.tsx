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

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface RichTextProps {
    content: unknown
    className?: string
    bannerSrc?: string
    bannerAlt?: string
    backendUrl?: string
    variant?: 'default' | 'article'
}

const BANNER_MARKER_REGEX = /\[\[BANNER(?::([^\]]+))?\]\]/
const DEFAULT_BANNER_SRC = '/images/latest-posts-bottom-banner.png'
const ARTICLE_HEADING_CLASS = 'text-[#FCFCFC] text-[32px] font-medium leading-[40px] tracking-[-0.64px] my-0'
const ARTICLE_H5_CLASS = 'text-[#FCFCFC] text-[20px] font-normal leading-[32px] tracking-normal my-0 !mb-5'
const ARTICLE_UNORDERED_LIST_CLASS = 'my-0 list-disc pl-7 leading-[32px] marker:text-[#9E9E9E]'
const ARTICLE_ORDERED_LIST_CLASS = 'my-0 list-decimal pl-7 leading-[32px] marker:text-[#9E9E9E]'
const ARTICLE_LIST_ITEM_CLASS = 'last:mb-0 text-[#9E9E9E] font-poppins text-[20px] font-normal leading-[32px] tracking-normal'
const ARTICLE_TEXT_BANNER_STYLE: React.CSSProperties = {
    width: '100%',
    maxWidth: 796,
    height: 'auto',
    aspectRatio: '675 / 86',
    borderRadius: 40,
    position: 'relative',
}
const ARTICLE_TEXT_BANNER_SIZES = '(max-width: 860px) 100vw, 796px'

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

const isHeadingTag = (value: string | undefined): value is HeadingTag =>
    value === 'h1'
    || value === 'h2'
    || value === 'h3'
    || value === 'h4'
    || value === 'h5'
    || value === 'h6'

const getHeadingTag = (node: LexicalNode): HeadingTag => {
    const typeTag = node.type?.toLowerCase()
    if (isHeadingTag(typeTag)) {
        return typeTag
    }

    const explicitTag = node.tag?.toLowerCase()
    if (isHeadingTag(explicitTag)) {
        return explicitTag
    }

    if (typeof node.level === 'number' && Number.isFinite(node.level)) {
        const clampedLevel = Math.min(6, Math.max(1, Math.round(node.level)))
        return `h${clampedLevel}` as HeadingTag
    }

    return 'h1'
}

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

const paragraphHasBannerMarker = (node: LexicalNode | undefined): boolean => {
    if (!node || node.type !== 'paragraph' || !node.children) {
        return false
    }

    const paragraphText = node.children
        .filter((child) => child.type === 'text')
        .map((child) => child.text || '')
        .join('')

    return BANNER_MARKER_REGEX.test(paragraphText)
}

const isHeadingNode = (node: LexicalNode | undefined): boolean => {
    if (!node) {
        return false
    }

    return node.type === 'heading'
        || node.type === 'h1'
        || node.type === 'h2'
        || node.type === 'h3'
        || node.type === 'h4'
        || node.type === 'h5'
        || node.type === 'h6'
}

const RichText: React.FC<RichTextProps> = ({
    content,
    className,
    bannerSrc = DEFAULT_BANNER_SRC,
    bannerAlt = 'Banner',
    backendUrl,
    variant = 'default',
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
        let lastPushedWasParagraph = false

        const pushParagraph = (keySuffix: string) => {
            if (paragraphParts.length === 0) {
                return
            }

            blocks.push(
                <p key={`${parentIndex}-text-${keySuffix}`} className="!mb-0">
                    {paragraphParts}
                </p>,
            )
            paragraphParts = []
            lastPushedWasParagraph = true
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
                    <div key={`${parentIndex}-banner-${childIndex}-${partIndex}`} className={lastPushedWasParagraph ? 'mt-8' : undefined}>
                        <Banner
                            src={part.src || bannerSrc}
                            alt={bannerAlt}
                            containerStyle={ARTICLE_TEXT_BANNER_STYLE}
                            sizes={ARTICLE_TEXT_BANNER_SIZES}
                        />
                    </div>,
                )
                lastPushedWasParagraph = false
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
            const previousNode = index > 0 ? nodes[index - 1] : undefined
            const nextNode = nodes[index + 1]

            switch (node.type) {
                case 'paragraph':
                    if (node.children) {
                        const parsedParagraph = renderParagraphWithBannerMarkers(node.children, index)
                        if (parsedParagraph) {
                            return parsedParagraph
                        }
                    }
                    return (
                        <p key={index} className="!mb-0">
                            {node.children ? renderNodes(node.children) : null}
                        </p>
                    )
                case 'text':
                    return renderTextNode(node.text, node.format, `text-${index}`)
                case 'heading':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    const HeadingTag = getHeadingTag(node) as keyof React.JSX.IntrinsicElements
                    const previousIsBannerBlock = previousNode?.type === 'block' && previousNode.fields?.blockType === 'banner'
                    const previousHasInlineBanner = paragraphHasBannerMarker(previousNode)
                    const headingSpacingClass = (index === 0 || previousIsBannerBlock || previousHasInlineBanner) ? 'mt-0' : 'mt-[20px]'
                    const headingTypographyClass =
                        variant === 'article' && HeadingTag === 'h5'
                            ? ARTICLE_H5_CLASS
                            : ARTICLE_HEADING_CLASS
                    return (
                        <HeadingTag key={index} className={`${headingTypographyClass} ${headingSpacingClass}`}>
                            {node.children ? renderNodes(node.children) : null}
                        </HeadingTag>
                    )
                case 'list':
                    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
                    const listClassName = node.listType === 'number'
                        ? ARTICLE_ORDERED_LIST_CLASS
                        : ARTICLE_UNORDERED_LIST_CLASS
                    const computedListClassName = isHeadingNode(nextNode)
                        ? `${listClassName} !mb-0`
                        : listClassName
                    return (
                        <ListTag key={index} className={computedListClassName}>
                            {node.children ? renderNodes(node.children) : null}
                        </ListTag>
                    )
                case 'listitem':
                    return (
                        <li key={index} className={ARTICLE_LIST_ITEM_CLASS}>
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
                        <div
                            key={index}
                            className="relative min-h-[176px] overflow-hidden rounded-r-[10px] border-l-[5px] border-[#F29F04] py-6 pr-6 pl-[56px] my-0"
                            style={{
                                background: 'linear-gradient(214deg, #1A1A1A -13.97%, #1A1A1A 68.06%, rgba(255, 58, 41, 0.10) 305.37%)',
                            }}
                        >
                            <blockquote className="relative z-10 text-[#FCFCFC] font-poppins text-[24px] font-medium italic leading-[32px] tracking-normal [&_p]:!text-[#FCFCFC] [&_p]:!font-poppins [&_p]:!text-[24px] [&_p]:!font-medium [&_p]:!leading-[32px] [&_p]:!tracking-normal [&_p]:italic [&_p:not(:last-child)]:!mb-6 [&_p:last-child]:!mb-0">
                                {node.children ? renderNodes(node.children) : null}
                            </blockquote>
                            <div className="pointer-events-none absolute right-[-221px] top-[-179px] h-[235px] w-[235px] rounded-full bg-[#F29F04] opacity-80 blur-[100px]" />
                            <div className="pointer-events-none absolute left-[-118px] bottom-[-240px] h-[235px] w-[235px] rounded-full bg-[#FCB42D] opacity-50 blur-[30px]" />
                            <div className="pointer-events-none absolute right-[-123px] top-[18px] h-[235px] w-[235px] rounded-full bg-[#404040] opacity-20 blur-[100px]" />
                        </div>
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
                            <div key={index} className={previousNode?.type === 'paragraph' ? 'mt-8' : undefined}>
                                <Banner
                                    src={blockSrc}
                                    alt={blockAlt}
                                    containerStyle={ARTICLE_TEXT_BANNER_STYLE}
                                    sizes={ARTICLE_TEXT_BANNER_SIZES}
                                />
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
        <div className={`rich-text flex flex-col [&>*]:mb-8 [&>*:last-child]:!mb-0 ${className || ''}`.trim()}>
            {renderNodes(content.root.children)}
        </div>
    )
}

export default RichText
