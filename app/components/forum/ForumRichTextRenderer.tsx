import React, { Fragment } from 'react'
import Image from 'next/image'
import {
  extractPlainTextFromForumRichText,
  isForumRichTextDocument,
  normalizeForumRichTextValue,
  type ForumRichTextNode,
} from '@/lib/forumRichText'

type ForumRichTextRendererProps = {
  content: unknown
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
}

const asString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const toAbsoluteMediaUrl = (url?: string | null): string | null => {
  if (!url) {
    return null
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const normalizedBase = BACKEND_BASE_URL.endsWith('/')
    ? BACKEND_BASE_URL.slice(0, -1)
    : BACKEND_BASE_URL
  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  return `${normalizedBase}${normalizedPath}`
}

const applyTextFormatting = (value: React.ReactNode, format?: number | '') => {
  const normalizedFormat = typeof format === 'number' ? format : 0
  let rendered = value

  if (normalizedFormat & 16) {
    rendered = <code className="rounded bg-[#1A1A1A] px-1.5 py-0.5 text-[#F5D27A]">{rendered}</code>
  }
  if (normalizedFormat & 8) {
    rendered = <span className="underline">{rendered}</span>
  }
  if (normalizedFormat & 4) {
    rendered = <span className="line-through">{rendered}</span>
  }
  if (normalizedFormat & 2) {
    rendered = <em>{rendered}</em>
  }
  if (normalizedFormat & 1) {
    rendered = <strong className="font-semibold text-white">{rendered}</strong>
  }

  return rendered
}

const renderNodes = (nodes: ForumRichTextNode[], prefix: string): React.ReactNode[] =>
  nodes.map((node, index) => {
    const key = `${prefix}-${index}`

    switch (node.type) {
      case 'text':
        return <Fragment key={key}>{applyTextFormatting(node.text || '', node.format)}</Fragment>
      case 'linebreak':
        return <br key={key} />
      case 'paragraph':
        return (
          <p key={key} className="m-0 break-words text-white font-poppins text-[20px] font-medium leading-[32px]">
            {Array.isArray(node.children) ? renderNodes(node.children, `${key}-p`) : null}
          </p>
        )
      case 'link':
        return (
          <a
            key={key}
            href={typeof node.url === 'string' ? node.url : '#'}
            target={typeof node.url === 'string' && /^https?:\/\//i.test(node.url) ? '_blank' : undefined}
            rel={typeof node.url === 'string' && /^https?:\/\//i.test(node.url) ? 'noopener noreferrer' : undefined}
            className="break-words text-[#F29F04] underline-offset-4 hover:underline"
          >
            {Array.isArray(node.children) ? renderNodes(node.children, `${key}-link`) : null}
          </a>
        )
      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul'
        return (
          <ListTag
            key={key}
            className={`m-0 pl-6 text-white font-poppins text-[20px] font-medium leading-[32px] ${
              node.listType === 'number' ? 'list-decimal' : 'list-disc'
            }`}
          >
            {Array.isArray(node.children) ? renderNodes(node.children, `${key}-list`) : null}
          </ListTag>
        )
      case 'listitem':
        return (
          <li key={key} className="break-words">
            {Array.isArray(node.children) ? renderNodes(node.children, `${key}-item`) : null}
          </li>
        )
      case 'upload':
      case 'image':
        const valueRecord = asRecord(node.value)
        const src = toAbsoluteMediaUrl(
          asString(node.src)
          || asString(node.url)
          || asString(valueRecord?.url)
          || asString(valueRecord?.src),
        )

        if (!src) {
          return null
        }

        const alt = asString(node.altText) || asString(valueRecord?.altText) || 'Forum image'
        const width = typeof node.width === 'number' && node.width > 0 ? node.width : 1400
        const height = typeof node.height === 'number' && node.height > 0 ? node.height : 800

        return (
          <figure
            key={key}
            className="m-0 flex justify-center overflow-hidden rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#202020] p-2"
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 860px) 100vw, 760px"
              className="mx-auto h-auto max-h-[520px] w-auto max-w-full object-contain"
            />
          </figure>
        )
      default:
        if (Array.isArray(node.children)) {
          return <Fragment key={key}>{renderNodes(node.children, `${key}-fallback`)}</Fragment>
        }

        return null
    }
  })

const ForumRichTextRenderer: React.FC<ForumRichTextRendererProps> = ({ content }) => {
  const normalizedContent = normalizeForumRichTextValue(content)

  if (normalizedContent) {
    return (
      <div className="flex flex-col gap-4">
        {renderNodes(normalizedContent.root.children, 'forum-rich-text')}
      </div>
    )
  }

  if (typeof content === 'string') {
    return (
      <p className="m-0 whitespace-pre-line break-words text-white font-poppins text-[20px] font-medium leading-[32px]">
        {content}
      </p>
    )
  }

  if (!isForumRichTextDocument(content)) {
    const fallbackText = extractPlainTextFromForumRichText(content)
    return fallbackText ? (
      <p className="m-0 whitespace-pre-line break-words text-white font-poppins text-[20px] font-medium leading-[32px]">
        {fallbackText}
      </p>
    ) : null
  }

  return null
}

export default ForumRichTextRenderer
