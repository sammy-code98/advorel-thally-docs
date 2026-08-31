/**
 * Starter-owned coverage for route static parameters.
 *
 * The runtime-owned test assumes the starter publishes API reference content.
 * This site does not, so the API route legitimately has no filesystem paths.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiReferenceConfig } from '@/config/api-reference'
import { getDocEntries } from '@/data/docs'
import { resetContentSourceForTests } from '@/lib/content-source'
import { generateStaticParams as rootParams } from '@/app/(docs)/[[...slug]]/page'
import { generateStaticParams as apiParams } from '@/app/(docs)/api/[[...slug]]/page'

const savedEnv = process.env.THALLY_CONTENT_SOURCE

const routes = [
  { name: '[[...slug]]', generateStaticParams: rootParams },
  { name: 'api/[[...slug]]', generateStaticParams: apiParams },
]

beforeEach(() => {
  delete process.env.THALLY_CONTENT_SOURCE
  resetContentSourceForTests()
})

afterEach(() => {
  if (savedEnv === undefined) delete process.env.THALLY_CONTENT_SOURCE
  else process.env.THALLY_CONTENT_SOURCE = savedEnv
  resetContentSourceForTests()
})

describe('doc route generateStaticParams', () => {
  it.each(routes)('$name prerenders nothing under the assets source', async ({ generateStaticParams }) => {
    process.env.THALLY_CONTENT_SOURCE = 'assets'
    resetContentSourceForTests()

    await expect(generateStaticParams()).resolves.toEqual([])
  })

  const hasApiContent =
    apiReferenceConfig.specs.length > 0 ||
    getDocEntries().some((doc) => doc.slug[0] === 'api' && doc.slug.length > 1)

  it.each([
    { name: '[[...slug]]', generateStaticParams: rootParams },
    ...(hasApiContent ? [{ name: 'api/[[...slug]]', generateStaticParams: apiParams }] : []),
  ])('$name still prerenders under the default filesystem source', async ({ generateStaticParams }) => {
    await expect(generateStaticParams()).resolves.not.toEqual([])
  })
})
