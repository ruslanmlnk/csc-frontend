import { NextResponse } from 'next/server'
import { backendRequest } from '@/lib/backend/client'
import { getBackendErrorMessage } from '@/lib/backend/errors'

type UnknownRecord = Record<string, unknown>

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return null
}

const encodeWhereValue = (value: string) => value.replace(/"/g, '\\"')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = normalizeSlug(searchParams.get('slug'))

  const query = slug
    ? `/api/forum-sub-categories?limit=200&sort=name&depth=1&where[slug][equals]=${encodeURIComponent(
        encodeWhereValue(slug),
      )}`
    : '/api/forum-sub-categories?limit=200&sort=name&depth=1'

  const { ok, status, data } = await backendRequest<Record<string, unknown>>(query, {
    cache: 'no-store',
  })

  if (!ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(data, 'Unable to load forum subcategories.') },
      { status },
    )
  }

  const payload = asRecord(data)
  const docs = Array.isArray(payload?.docs) ? payload.docs : []

  const subCategories = docs.reduce<
    Array<{
      id: string
      name: string
      slug?: string
      description?: string
      textAboveDate?: string
      date?: string
      categoryName?: string
      categorySlug?: string
      categoryId?: string
    }>
  >(
    (acc, item) => {
      const record = asRecord(item)
      if (!record) {
        return acc
      }

      const id = asString(record.id)
      const name = asString(record.name)
      if (!id || !name) {
        return acc
      }

      const subCategorySlug = asString(record.slug) || undefined
      const description = asString(record.description) || undefined
      const textAboveDate = asString(record.textAboveDate) || undefined
      const date = asString(record.date) || undefined
      const categoryRecord = asRecord(record.category)
      const categoryName = asString(categoryRecord?.name)
      const categorySlug = asString(categoryRecord?.slug) || undefined
      const categoryId = asString(categoryRecord?.id) || undefined

      if (categoryName) {
        acc.push({
          id,
          name,
          slug: subCategorySlug,
          description,
          textAboveDate,
          date,
          categoryName,
          categorySlug,
          categoryId,
        })
      } else {
        acc.push({
          id,
          name,
          slug: subCategorySlug,
          description,
          textAboveDate,
          date,
          categorySlug,
          categoryId,
        })
      }

      return acc
    },
    [],
  )

  return NextResponse.json({ subCategories })
}

function normalizeSlug(value: string | null): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim().toLowerCase()
  return trimmed || null
}
