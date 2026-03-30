'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bold, ImagePlus, Italic, Link2, List, ListOrdered, Smile, Strikethrough, Underline } from 'lucide-react'
import { useLanguage } from '@/app/components/i18n/LanguageProvider'
import { createEmptyForumRichText, createForumUploadNode, extractPlainTextFromForumRichText, hasVisibleForumRichTextContent, type ForumRichTextDocument, type ForumRichTextNode } from '@/lib/forumRichText'

type ForumRichTextEditorProps = {
  placeholder: string
  disabled?: boolean
  onChange: (value: ForumRichTextDocument, plainText: string) => void
}

type UploadedMediaResponse = {
  id?: string | number | null
  url?: string | null
  altText?: string | null
  width?: number
  height?: number
  error?: string
}

type InlineSerializeOptions = {
  format: number
}

const FORUM_EDITOR_EMOJIS = ['😀', '😂', '😍', '🤔', '🔥', '👍', '👏', '🎉', '🚀', '💡', '✅', '❤️']

const FORUM_UPLOAD_RELATION = 'media'

const createTextNode = (text: string, format: number): ForumRichTextNode => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const createLineBreakNode = (): ForumRichTextNode => ({
  type: 'linebreak',
  version: 1,
})

const createParagraphNode = (children: ForumRichTextNode[]): ForumRichTextNode => ({
  type: 'paragraph',
  children,
  direction: null,
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

const createEmptyParagraphElement = (): HTMLParagraphElement => {
  const paragraph = document.createElement('p')
  paragraph.appendChild(document.createElement('br'))
  return paragraph
}

const parsePositiveNumber = (value: string | null | undefined): number | undefined => {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const normalizeHref = (href: string): string => {
  const trimmed = href.trim()

  if (
    /^https?:\/\//i.test(trimmed)
    || /^mailto:/i.test(trimmed)
    || /^tel:/i.test(trimmed)
    || trimmed.startsWith('/')
    || trimmed.startsWith('#')
  ) {
    return trimmed
  }

  return /^www\./i.test(trimmed) ? `https://${trimmed}` : `https://${trimmed}`
}

const createEditorNodeId = (): string =>
  globalThis.crypto?.randomUUID?.()
  || `forum-node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

const parseDocumentId = (value: string | null | undefined): number | string | null => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed
}

const createLinkNode = (children: ForumRichTextNode[], url: string): ForumRichTextNode => ({
  type: 'link',
  id: createEditorNodeId(),
  fields: {
    doc: null,
    linkType: 'custom',
    newTab: /^https?:\/\//i.test(url),
    url,
  },
  children,
  direction: null,
  format: '',
  indent: 0,
  version: 3,
})

const getElementFormat = (element: HTMLElement, inherited: number): number => {
  let nextFormat = inherited
  const tagName = element.tagName.toLowerCase()

  if (tagName === 'strong' || tagName === 'b') nextFormat |= 1
  if (tagName === 'em' || tagName === 'i') nextFormat |= 2
  if (tagName === 's' || tagName === 'strike' || tagName === 'del') nextFormat |= 4
  if (tagName === 'u') nextFormat |= 8
  if (tagName === 'code') nextFormat |= 16

  return nextFormat
}

const serializeInlineNode = (node: ChildNode, options: InlineSerializeOptions): ForumRichTextNode[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    return text.length > 0 ? [createTextNode(text, options.format)] : []
  }

  if (!(node instanceof HTMLElement)) {
    return []
  }

  const tagName = node.tagName.toLowerCase()

  if (tagName === 'br') {
    return [createLineBreakNode()]
  }

  if (tagName === 'a') {
    const href = node.getAttribute('href')?.trim()
    const children = Array.from(node.childNodes).flatMap((child) =>
      serializeInlineNode(child, { format: options.format }),
    )

    if (!href || children.length === 0) {
      return children
    }

    return [
      createLinkNode(children, normalizeHref(href)),
    ]
  }

  if (tagName === 'img') {
    const src = node.getAttribute('src')?.trim()
    const mediaId = parseDocumentId(node.getAttribute('data-lexical-upload-id'))

    if (!src || mediaId === null) {
      return []
    }

    return [
      createForumUploadNode({
        id: mediaId,
        altText: node.getAttribute('alt')?.trim() || 'Uploaded image',
        relationTo:
          node.getAttribute('data-lexical-upload-relation-to')?.trim()
          || FORUM_UPLOAD_RELATION,
      }),
    ]
  }

  const nextFormat = getElementFormat(node, options.format)
  return Array.from(node.childNodes).flatMap((child) =>
    serializeInlineNode(child, { format: nextFormat }),
  )
}

const serializeBlockNode = (node: ChildNode): ForumRichTextNode[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim()
    return text ? [createParagraphNode([createTextNode(text, 0)])] : []
  }

  if (!(node instanceof HTMLElement)) {
    return []
  }

  const tagName = node.tagName.toLowerCase()

  if (tagName === 'figure' || tagName === 'img') {
    const imageElement = tagName === 'img' ? node : node.querySelector('img')
    const src = imageElement?.getAttribute('src')?.trim()
    const mediaId = parseDocumentId(imageElement?.getAttribute('data-lexical-upload-id'))

    if (!src || mediaId === null) {
      return []
    }

    return [
      createForumUploadNode({
        id: mediaId,
        altText: imageElement?.getAttribute('alt')?.trim() || 'Uploaded image',
        relationTo:
          imageElement?.getAttribute('data-lexical-upload-relation-to')?.trim()
          || FORUM_UPLOAD_RELATION,
      }),
    ]
  }

  if (tagName === 'ul' || tagName === 'ol') {
    const orderedListStart = parsePositiveNumber(node.getAttribute('start')) || 1

    return [
      {
        type: 'list',
        listType: tagName === 'ol' ? 'number' : 'bullet',
        tag: tagName,
        start: orderedListStart,
        children: Array.from(node.children)
          .filter((child) => child.tagName.toLowerCase() === 'li')
          .map((item, index) => ({
            type: 'listitem',
            checked: false,
            value: parsePositiveNumber(item.getAttribute('value')) || orderedListStart + index,
            children: [
              createParagraphNode(
                Array.from(item.childNodes).flatMap((child) => serializeInlineNode(child, { format: 0 })),
              ),
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          })),
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    ]
  }

  const inlineChildren = Array.from(node.childNodes).flatMap((child) => serializeInlineNode(child, { format: 0 }))

  if (inlineChildren.length === 0 && tagName !== 'p' && tagName !== 'div') {
    return []
  }

  if (
    (tagName === 'p' || tagName === 'div')
    && inlineChildren.every((child) => child.type === 'linebreak')
  ) {
    return [createParagraphNode([])]
  }

  return [createParagraphNode(inlineChildren)]
}

const serializeEditorHtmlToDocument = (editor: HTMLElement): ForumRichTextDocument => {
  const rootChildren = Array.from(editor.childNodes).flatMap((child) => serializeBlockNode(child))
  const normalizedChildren = rootChildren.length > 0 ? rootChildren : createEmptyForumRichText().root.children

  return {
    root: {
      type: 'root',
      children: normalizedChildren,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

const ToolbarButton = ({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) => (
  <button
    type="button"
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[rgba(74,74,74,0.70)] bg-[#202020] text-[#FCFCFC] transition-colors hover:border-[#F29F04] hover:text-[#F29F04] disabled:cursor-not-allowed disabled:opacity-50"
    aria-label={label}
    title={label}
  >
    {children}
  </button>
)

const ForumRichTextEditor: React.FC<ForumRichTextEditorProps> = ({
  placeholder,
  disabled = false,
  onChange,
}) => {
  const { language } = useLanguage()
  const editorRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const savedSelectionRef = useRef<Range | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const enterLinkUrlLabel = language === 'uk' ? '\u0412\u0432\u0435\u0434\u0456\u0442\u044c URL \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f' : 'Enter link URL'
  const uploadErrorLabel = language === 'uk' ? '\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f.' : 'Unable to upload image.'
  const boldLabel = language === 'uk' ? '\u0416\u0438\u0440\u043d\u0438\u0439' : 'Bold'
  const italicLabel = language === 'uk' ? '\u041a\u0443\u0440\u0441\u0438\u0432' : 'Italic'
  const underlineLabel = language === 'uk' ? '\u041f\u0456\u0434\u043a\u0440\u0435\u0441\u043b\u0435\u043d\u043d\u044f' : 'Underline'
  const strikethroughLabel = language === 'uk' ? '\u0417\u0430\u043a\u0440\u0435\u0441\u043b\u0435\u043d\u0438\u0439' : 'Strikethrough'
  const bulletListLabel = language === 'uk' ? '\u041c\u0430\u0440\u043a\u043e\u0432\u0430\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a' : 'Bullet List'
  const numberedListLabel = language === 'uk' ? '\u041d\u0443\u043c\u0435\u0440\u043e\u0432\u0430\u043d\u0438\u0439 \u0441\u043f\u0438\u0441\u043e\u043a' : 'Numbered List'
  const addLinkLabel = language === 'uk' ? '\u0414\u043e\u0434\u0430\u0442\u0438 \u043f\u043e\u0441\u0438\u043b\u0430\u043d\u043d\u044f' : 'Add Link'
  const addImageLabel = language === 'uk' ? '\u0414\u043e\u0434\u0430\u0442\u0438 \u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043d\u044f' : 'Add Image'
  const addEmojiLabel = language === 'uk' ? '\u0414\u043e\u0434\u0430\u0442\u0438 \u0435\u043c\u043e\u0434\u0437\u0456' : 'Add Emoji'
  const uploadingLabel = language === 'uk' ? '\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f...' : 'Uploading...'

  useEffect(() => {
    if (!isEmojiPickerOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (target && emojiPickerRef.current?.contains(target)) {
        return
      }

      setIsEmojiPickerOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isEmojiPickerOpen])

  const syncEditorState = (maintainCaret = false) => {
    ensureEditorHasParagraph(maintainCaret)

    if (!editorRef.current) {
      return
    }

    const documentValue = serializeEditorHtmlToDocument(editorRef.current)
    const plainText = extractPlainTextFromForumRichText(documentValue)
    const hasVisibleContent = hasVisibleForumRichTextContent(documentValue)

    setIsEmpty(!hasVisibleContent)
    onChange(documentValue, plainText)
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor || editor.childNodes.length > 0) {
      return
    }

    editor.appendChild(createEmptyParagraphElement())
  }, [])

  const focusEditor = () => {
    editorRef.current?.focus()
  }

  const isMeaningfulEditorNode = (node: ChildNode): boolean => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0
    }

    if (!(node instanceof HTMLElement)) {
      return false
    }

    const tagName = node.tagName.toLowerCase()
    if (tagName === 'br') {
      return false
    }

    if (
      (tagName === 'p' || tagName === 'div')
      && (node.textContent ?? '').trim().length === 0
      && !node.querySelector('img, figure, ul, ol')
    ) {
      return false
    }

    return true
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return
    }

    const range = selection.getRangeAt(0)
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      return
    }

    savedSelectionRef.current = range.cloneRange()
  }

  const placeCaretInside = (element: HTMLElement) => {
    const selection = window.getSelection()
    if (!selection) {
      return
    }

    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
  }

  const ensureEditorHasParagraph = (placeCaret = false) => {
    const editor = editorRef.current
    if (!editor) {
      return
    }

    const hasMeaningfulContent = Array.from(editor.childNodes).some((node) => isMeaningfulEditorNode(node))
    if (hasMeaningfulContent) {
      return
    }

    let paragraph =
      editor.firstElementChild instanceof HTMLParagraphElement
        ? editor.firstElementChild
        : null

    if (!paragraph || editor.childNodes.length !== 1) {
      editor.replaceChildren(createEmptyParagraphElement())
      paragraph =
        editor.firstElementChild instanceof HTMLParagraphElement
          ? editor.firstElementChild
          : null
    }

    if (placeCaret && paragraph && document.activeElement === editor) {
      placeCaretInside(paragraph)
    }
  }

  const restoreSelection = () => {
    const selection = window.getSelection()
    const savedRange = savedSelectionRef.current

    if (!selection || !savedRange) {
      return false
    }

    selection.removeAllRanges()
    selection.addRange(savedRange)
    return true
  }

  const appendUploadedImageBlock = (payload: {
    id?: string | number
    url: string
    altText: string
    width?: number
    height?: number
  }) => {
    const editor = editorRef.current
    if (!editor) {
      return
    }

    const figure = document.createElement('figure')
    figure.dataset.forumUpload = 'true'
    figure.style.display = 'inline-flex'
    figure.style.width = 'fit-content'
    figure.style.maxWidth = 'min(100%, 420px)'
    figure.style.margin = '16px 0'
    figure.style.overflow = 'hidden'
    figure.style.borderRadius = '20px'
    figure.style.border = '1px solid rgba(74, 74, 74, 0.70)'
    figure.style.background = '#202020'

    const image = document.createElement('img')
    image.src = payload.url
    image.alt = payload.altText
    if (payload.id !== undefined && payload.id !== null) {
      image.setAttribute('data-lexical-upload-id', String(payload.id))
      image.setAttribute('data-lexical-upload-relation-to', FORUM_UPLOAD_RELATION)
    }
    image.style.display = 'block'
    image.style.maxWidth = '100%'
    image.style.width = 'auto'
    image.style.height = 'auto'
    image.style.maxHeight = '320px'
    image.style.objectFit = 'contain'

    if (payload.width) {
      image.width = payload.width
    }

    if (payload.height) {
      image.height = payload.height
    }

    figure.appendChild(image)

    const paragraph = createEmptyParagraphElement()

    const hasMeaningfulContent = Array.from(editor.childNodes).some((node) => isMeaningfulEditorNode(node))
    if (hasMeaningfulContent) {
      editor.appendChild(figure)
      editor.appendChild(paragraph)
    } else {
      editor.replaceChildren(figure, paragraph)
    }

    focusEditor()
    placeCaretInside(paragraph)
    syncEditorState(true)
  }

  const runCommand = (command: string, value?: string) => {
    focusEditor()
    restoreSelection()
    document.execCommand(command, false, value)
    saveSelection()
    syncEditorState(true)
  }

  const handleEmojiSelect = (emoji: string) => {
    const editor = editorRef.current
    if (!editor) {
      return
    }

    focusEditor()
    if (!restoreSelection()) {
      placeCaretInside(editor)
    }

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return
    }

    const range = selection.getRangeAt(0)
    const textNode = document.createTextNode(emoji)

    range.deleteContents()
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
    setIsEmojiPickerOpen(false)
    syncEditorState(true)
  }

  const handleLinkAction = () => {
    const url = window.prompt(enterLinkUrlLabel)
    if (!url) {
      return
    }

    runCommand('createLink', normalizeHref(url))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('altText', file.name.replace(/\.[^.]+$/, ''))

      const response = await fetch('/api/forum/media', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json().catch(() => null)) as UploadedMediaResponse | null
      if (!response.ok || !payload?.url || payload.id === undefined || payload.id === null) {
        throw new Error(payload?.error || uploadErrorLabel)
      }

      focusEditor()
      appendUploadedImageBlock({
        id: payload.id ?? undefined,
        url: payload.url,
        altText: payload.altText || file.name,
        width: payload.width,
        height: payload.height,
      })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : uploadErrorLabel)
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarButton label={boldLabel} onClick={() => runCommand('bold')} disabled={disabled || isUploadingImage}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label={italicLabel} onClick={() => runCommand('italic')} disabled={disabled || isUploadingImage}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton label={underlineLabel} onClick={() => runCommand('underline')} disabled={disabled || isUploadingImage}>
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton label={strikethroughLabel} onClick={() => runCommand('strikeThrough')} disabled={disabled || isUploadingImage}>
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton label={bulletListLabel} onClick={() => runCommand('insertUnorderedList')} disabled={disabled || isUploadingImage}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label={numberedListLabel} onClick={() => runCommand('insertOrderedList')} disabled={disabled || isUploadingImage}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <div ref={emojiPickerRef} className="relative">
          <ToolbarButton
            label={addEmojiLabel}
            onClick={() => setIsEmojiPickerOpen((current) => !current)}
            disabled={disabled || isUploadingImage}
          >
            <Smile size={16} />
          </ToolbarButton>
          {isEmojiPickerOpen ? (
            <div className="absolute left-0 top-12 z-20 w-[220px] rounded-[20px] border border-[rgba(74,74,74,0.70)] bg-[#202020] p-3 shadow-2xl">
              <div className="grid grid-cols-4 gap-2">
                {FORUM_EDITOR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-[22px] transition-colors hover:bg-[#2C2C2C]"
                    aria-label={`${addEmojiLabel}: ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <ToolbarButton label={addLinkLabel} onClick={handleLinkAction} disabled={disabled || isUploadingImage}>
          <Link2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label={isUploadingImage ? uploadingLabel : addImageLabel}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploadingImage}
        >
          <ImagePlus size={16} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="relative">
        {isEmpty ? (
          <div className="pointer-events-none absolute left-6 top-6 text-[#6C6C6C] font-poppins text-[18px] leading-[24px]">
            {placeholder}
          </div>
        ) : null}

        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={() => {
            syncEditorState(true)
            saveSelection()
          }}
          onBlur={() => {
            saveSelection()
            syncEditorState(false)
          }}
          onFocus={() => {
            ensureEditorHasParagraph(false)
            saveSelection()
          }}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          className="min-h-[150px] rounded-[30px] bg-[#262626] p-6 text-white font-poppins text-[18px] leading-[28px] outline-none [&_a]:text-[#F29F04] [&_a]:underline [&_figure]:my-4 [&_figure]:max-w-full [&_figure]:overflow-hidden [&_figure]:rounded-[20px] [&_figure]:border [&_figure]:border-[rgba(74,74,74,0.70)] [&_figure]:bg-[#202020] [&_img]:block [&_img]:h-auto [&_img]:max-h-[320px] [&_img]:max-w-full [&_img]:rounded-[20px] [&_img]:object-contain [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:min-h-[28px] [&_p]:break-words [&_p]:whitespace-pre-wrap [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        />
      </div>
    </div>
  )
}

export default ForumRichTextEditor
