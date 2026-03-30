export type ForumRichTextNode = {
  type: string
  children?: ForumRichTextNode[]
  text?: string
  format?: number | ''
  url?: string
  id?: string
  fields?: Record<string, unknown>
  listType?: string
  relationTo?: string
  src?: string
  altText?: string
  width?: number
  height?: number
  value?: unknown
  [key: string]: unknown
}

export type ForumRichTextDocument = {
  root: {
    type: 'root'
    children: ForumRichTextNode[]
    direction: null
    format: ''
    indent: 0
    version: 1
  }
}

type UnknownRecord = Record<string, unknown>

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const normalizeDocumentId = (value: unknown): number | string | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed
}

const createForumNodeId = (): string => {
  const randomUUID = globalThis.crypto?.randomUUID?.()
  if (typeof randomUUID === 'string' && randomUUID.length > 0) {
    return randomUUID
  }

  return `forum-node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const createEmptyForumRichText = (): ForumRichTextDocument => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
})

export const isForumRichTextDocument = (value: unknown): value is ForumRichTextDocument => {
  const record = asRecord(value)
  const root = asRecord(record?.root)

  return Boolean(root && root.type === 'root' && Array.isArray(root.children))
}

const looksLikeSerializedJson = (value: string): boolean => {
  const trimmed = value.trim()

  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
    || (trimmed.startsWith('[') && trimmed.endsWith(']'))
    || (trimmed.startsWith('"') && trimmed.endsWith('"'))
  )
}

const nodeHasVisibleContent = (node: ForumRichTextNode | null | undefined): boolean => {
  if (!node) {
    return false
  }

  if (node.type === 'text') {
    return typeof node.text === 'string' && node.text.trim().length > 0
  }

  if (node.type === 'upload' || node.type === 'image') {
    const valueRecord = asRecord(node.value)
    const valueId = normalizeDocumentId(node.value)
    return Boolean(
      valueId !== null
      || normalizeDocumentId(valueRecord?.id) !== null
      || normalizeDocumentId(node.id) !== null
      || asString(node.src)
      || asString(node.url)
      || asString(valueRecord?.url)
      || asString(valueRecord?.src),
    )
  }

  if (Array.isArray(node.children)) {
    return node.children.some((child) => nodeHasVisibleContent(child))
  }

  return false
}

const extractNodePlainText = (node: ForumRichTextNode | null | undefined): string => {
  if (!node) {
    return ''
  }

  if (node.type === 'text') {
    return typeof node.text === 'string' ? node.text : ''
  }

  if (node.type === 'linebreak') {
    return '\n'
  }

  if (node.type === 'list') {
    return (node.children || [])
      .map((child) => extractNodePlainText(child))
      .filter((value) => value.length > 0)
      .join('\n')
  }

  if (node.type === 'listitem') {
    return (node.children || [])
      .map((child) => extractNodePlainText(child))
      .join('')
      .trim()
  }

  if (Array.isArray(node.children)) {
    const joined = node.children.map((child) => extractNodePlainText(child)).join('')
    return node.type === 'paragraph' ? `${joined}\n\n` : joined
  }

  return ''
}

const extractDocumentPlainText = (value: ForumRichTextDocument): string =>
  value.root.children
    .map((child) => extractNodePlainText(child))
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const tryParseSerializedForumRichText = (
  value: string,
  depth = 0,
): ForumRichTextDocument | null => {
  if (depth > 2 || !looksLikeSerializedJson(value)) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as unknown

    if (typeof parsed === 'string') {
      return tryParseSerializedForumRichText(parsed, depth + 1)
    }

    if (!isForumRichTextDocument(parsed)) {
      return null
    }

    const nestedDocument = tryParseSerializedForumRichText(
      extractDocumentPlainText(parsed),
      depth + 1,
    )

    return nestedDocument || parsed
  } catch {
    return null
  }
}

export const normalizeForumRichTextValue = (value: unknown): ForumRichTextDocument | null => {
  if (typeof value === 'string') {
    return tryParseSerializedForumRichText(value)
  }

  if (!isForumRichTextDocument(value)) {
    return null
  }

  const nestedDocument = tryParseSerializedForumRichText(extractDocumentPlainText(value))
  return nestedDocument || value
}

export const extractPlainTextFromForumRichText = (value: unknown): string => {
  const normalizedDocument = normalizeForumRichTextValue(value)
  if (normalizedDocument) {
    return extractDocumentPlainText(normalizedDocument)
  }

  if (typeof value === 'string') {
    return value
  }

  if (!isForumRichTextDocument(value)) {
    return ''
  }

  return extractDocumentPlainText(value)
}

export const hasVisibleForumRichTextContent = (value: unknown): boolean => {
  const normalizedDocument = normalizeForumRichTextValue(value)
  if (normalizedDocument) {
    return normalizedDocument.root.children.some((child) => nodeHasVisibleContent(child))
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (!isForumRichTextDocument(value)) {
    return false
  }

  return value.root.children.some((child) => nodeHasVisibleContent(child))
}

export const createForumUploadNode = (payload: {
  id?: string | number | null
  url?: string
  altText?: string
  relationTo?: string | null
}): ForumRichTextNode => ({
  type: 'upload',
  id: createForumNodeId(),
  relationTo: asString(payload.relationTo) || 'media',
  value: normalizeDocumentId(payload.id) ?? '',
  fields: payload.altText ? { alt: payload.altText } : {},
  format: '',
  version: 3,
})
