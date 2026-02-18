import React, { Fragment } from 'react'
import Image from 'next/image'
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

type MediaDoc = {
    url?: string | null
}

const CONTACT_FALLBACK_ICON = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18.0407 16.5626C16.8508 14.5055 15.0172 13.0305 12.8774 12.3313C13.9358 11.7012 14.7582 10.741 15.2182 9.59833C15.6781 8.45561 15.7503 7.19349 15.4235 6.0058C15.0968 4.81811 14.3892 3.77051 13.4094 3.0239C12.4296 2.27728 11.2318 1.87292 10 1.87292C8.76821 1.87292 7.57044 2.27728 6.59067 3.0239C5.6109 3.77051 4.90331 4.81811 4.57654 6.0058C4.24978 7.19349 4.32193 8.45561 4.78189 9.59833C5.24186 10.741 6.06422 11.7012 7.12268 12.3313C4.98284 13.0297 3.14925 14.5047 1.9594 16.5626C1.91577 16.6337 1.88683 16.7129 1.87429 16.7954C1.86174 16.8779 1.86585 16.9621 1.88638 17.043C1.9069 17.1239 1.94341 17.1998 1.99377 17.2664C2.04413 17.333 2.10731 17.3888 2.17958 17.4305C2.25185 17.4722 2.33175 17.4991 2.41457 17.5095C2.49738 17.5198 2.58143 17.5135 2.66176 17.4909C2.74209 17.4682 2.81708 17.4297 2.88228 17.3776C2.94749 17.3255 3.00161 17.2609 3.04143 17.1876C4.51331 14.6438 7.11487 13.1251 10 13.1251C12.8852 13.1251 15.4867 14.6438 16.9586 17.1876C16.9985 17.2609 17.0526 17.3255 17.1178 17.3776C17.183 17.4297 17.258 17.4682 17.3383 17.4909C17.4186 17.5135 17.5027 17.5198 17.5855 17.5095C17.6683 17.4991 17.7482 17.4722 17.8205 17.4305C17.8927 17.3888 17.9559 17.333 18.0063 17.2664C18.0566 17.1998 18.0932 17.1239 18.1137 17.043C18.1342 16.9621 18.1383 16.8779 18.1258 16.7954C18.1132 16.7129 18.0843 16.6337 18.0407 16.5626ZM5.62503 7.50005C5.62503 6.63476 5.88162 5.7889 6.36235 5.06943C6.84308 4.34997 7.52636 3.78921 8.32579 3.45808C9.12522 3.12694 10.0049 3.0403 10.8535 3.20911C11.7022 3.37792 12.4818 3.7946 13.0936 4.40646C13.7055 5.01831 14.1222 5.79786 14.291 6.64653C14.4598 7.4952 14.3731 8.37486 14.042 9.17429C13.7109 9.97372 13.1501 10.657 12.4306 11.1377C11.7112 11.6185 10.8653 11.8751 10 11.8751C8.84009 11.8738 7.72801 11.4125 6.90781 10.5923C6.0876 9.77207 5.62627 8.65999 5.62503 7.50005Z" fill="white"/>
    </svg>
)

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

const getMediaUrlFromRelation = (relation: unknown): string | undefined => {
    if (!relation) {
        return undefined
    }

    if (typeof relation === 'string') {
        return relation
    }

    let value: unknown = relation
    if (isObject(relation) && 'value' in relation) {
        value = relation.value
    }

    if (typeof value === 'string') {
        return value
    }

    if (!isObject(value)) {
        return undefined
    }

    const mediaDoc = value as MediaDoc
    return typeof mediaDoc.url === 'string' ? mediaDoc.url : undefined
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

                    if (node.fields?.blockType === 'contact') {
                        const contactValue = typeof node.fields.contact === 'string' ? node.fields.contact.trim() : ''
                        const mediaUrl = getMediaUrlFromRelation(node.fields.icon)
                        const iconSrc = withBackendUrl(mediaUrl, backendUrl)

                        if (!contactValue && !iconSrc) {
                            return null
                        }

                        return (
                            <div key={index} className="my-0 flex items-center gap-[10px]">
                                <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
                                    {iconSrc ? (
                                        <Image
                                            src={iconSrc}
                                            alt="Contact icon"
                                            fill
                                            sizes="20px"
                                            className="object-contain"
                                        />
                                    ) : (
                                        CONTACT_FALLBACK_ICON
                                    )}
                                </span>
                                {contactValue ? (
                                    <span className="font-poppins text-[16px] font-normal leading-[26px] text-[#757575]">
                                        {contactValue}
                                    </span>
                                ) : null}
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
