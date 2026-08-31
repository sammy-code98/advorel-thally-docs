/**
 * Starter-owned replacement for src/lib/__tests__/doc-route-static-params.test.ts.
 *
 * That file is vendored: starter-release.json lists `src/lib/**` under
 * `frameworkSyncEligible`, so CI's `starter-runtime-contract.mjs check` requires
 * it to stay byte-identical to thallylabs/thally, and editing it in place fails
 * the pipeline. It is excluded in vitest.config.ts and its coverage lives here
 * instead, where this repo owns the file.
 *
 * The only assertion dropped is the upstream row claiming `api/[[...slug]]`
 * prerenders something under the filesystem source. That holds for the template,
 * which ships an API reference; this site removed it in 662ceef, so the route
 * has nothing to prerender and the row is false here. It is reinstated
 * automatically by `hasApiContent` below if an API reference is configured again.
 *
 * Everything else is preserved verbatim in intent:
 *
 * Under `THALLY_CONTENT_SOURCE=assets` every doc route must return an empty
 * param list, so nothing is baked into static HTML at build time. A route that
 * forgets the guard still prerenders the build's own content, and those pages
 * shadow the dynamic route on a managed site — it then serves the build's docs
 * instead of the customer's published ones.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiReferenceConfig } from '@/config/api-reference'
import { getDocEntries } from '@/data/docs'
import { resetContentSourceForTests } from '@/lib/content-source'
import { generateStaticParams as rootParams } from '@/app/(docs)/[[...slug]]/page'
import { generateStaticParams as localeParams } from '@/app/(docs)/[locale]/[[...slug]]/page'
import { generateStaticParams as apiParams } from '@/app/(docs)/api/[[...slug]]/page'

const savedEnv = process.env.THALLY_CONTENT_SOURCE

const routes = [
  { name: '[[...slug]]', generateStaticParams: rootParams },
  { name: '[locale]/[[...slug]]', generateStaticParams: localeParams },
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

  // Guards the guard: an unconditional `return []` would satisfy the assertions
  // above while silently dropping SSG for self-hosted and OSS builds. A row only
  // belongs here when this repo's docs.json actually gives the route something
  // to prerender — [locale] legitimately yields an empty list in either mode
  // when no secondary locale is configured, and api/ does the same when the site
  // configures neither an OpenAPI spec nor MDX pages under src/content/api/.
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
