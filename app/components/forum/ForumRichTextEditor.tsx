'use client'

import React, { useRef, useState } from 'react'
import { Bold, ImagePlus, Italic, Link2, List, ListOrdered, Strikethrough, Underline } from 'lucide-react'
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
      {
        type: 'link',
        url: normalizeHref(href),
        children,
        version: 1,
      },
    ]
  }

  if (tagName === 'img') {
    const src = node.getAttribute('src')?.trim()
    if (!src) {
      return []
    }

    return [
      createForumUploadNode({
        url: src,
        altText: node.getAttribute('alt')?.trim() || 'Uploaded image',
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
    if (!src) {
      return []
    }

    return [
      createForumUploadNode({
        url: src,
        altText: imageElement?.getAttribute('alt')?.trim() || 'Uploaded image',
      }),
    ]
  }

  if (tagName === 'ul' || tagName === 'ol') {
    return [
      {
        type: 'list',
        listType: tagName === 'ol' ? 'number' : 'bullet',
        tag: tagName,
        children: Array.from(node.children)
          .filter((child) => child.tagName.toLowerCase() === 'li')
          .map((item) => ({
            type: 'listitem',
            value: tagName === 'ol' ? Number(item.getAttribute('value') || 0) : undefined,
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
  const [isEmpty, setIsEmpty] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
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
  const uploadingLabel = language === 'uk' ? '\u0417\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u044f...' : 'Uploading...'

  const syncEditorState = () => {
    if (!editorRef.current) {
      return
    }

    const documentValue = serializeEditorHtmlToDocument(editorRef.current)
    const plainText = extractPlainTextFromForumRichText(documentValue)
    const hasVisibleContent = hasVisibleForumRichTextContent(documentValue)

    setIsEmpty(!hasVisibleContent)
    onChange(documentValue, plainText)
  }

  const focusEditor = () => {
    editorRef.current?.focus()
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

    const image = document.createElement('img')
    image.src = payload.url
    image.alt = payload.altText
    figure.appendChild(image)

    const paragraph = document.createElement('p')
    paragraph.appendChild(document.createElement('br'))

    editor.appendChild(figure)
    editor.appendChild(paragraph)

    focusEditor()
    placeCaretInside(paragraph)
    syncEditorState()
  }

  const runCommand = (command: string, value?: string) => {
    focusEditor()
    document.execCommand(command, false, value)
    syncEditorState()
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
      if (!response.ok || !payload?.url) {
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
          onInput={syncEditorState}
          onBlur={syncEditorState}
          className="min-h-[150px] rounded-[30px] bg-[#262626] p-6 text-white font-poppins text-[18px] leading-[28px] outline-none [&_a]:text-[#F29F04] [&_a]:underline [&_figure]:my-4 [&_figure]:overflow-hidden [&_figure]:rounded-[20px] [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[20px] [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:min-h-[28px] [&_p]:break-words [&_p]:whitespace-pre-wrap [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        />
      </div>
    </div>
  )
}

export default ForumRichTextEditor
