export type ForumRichTextNode = {
  type: string
  children?: ForumRichTextNode[]
  text?: string
  format?: number | ''
  url?: string
  listType?: string
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
    return Boolean(
      asString(node.src)
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
  url: string
  altText?: string
  width?: number
  height?: number
  id?: string | number
}): ForumRichTextNode => ({
  type: 'upload',
  src: payload.url,
  altText: payload.altText || 'Uploaded image',
  width: payload.width,
  height: payload.height,
  version: 1,
  value: {
    id: payload.id,
    url: payload.url,
    altText: payload.altText || 'Uploaded image',
    width: payload.width,
    height: payload.height,
  },
})
