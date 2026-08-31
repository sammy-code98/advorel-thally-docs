import type { MDXComponents } from 'mdx/types'

interface ToolLinkProps {
  href: string
  logo: string
  name: string
}

function ToolLink({ href, logo, name }: ToolLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="not-prose my-4 inline-flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- locally hosted vendor marks retain their native proportions. */}
      <img src={logo} alt={`${name} logo`} width="28" height="28" className="h-7 w-7 object-contain" />
      <span>Visit {name}</span>
    </a>
  )
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THIS FILE IS YOURS.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Register your own components here to use them in any `.mdx` page. No core
 *  files to touch, and nothing here is overwritten when you update Thally.
 *
 *  Anything you add is merged on top of Thally's built-in components, so you can:
 *    • add brand-new components (e.g. <PricingTable/>, <Roadmap/>), and
 *    • override a built-in by using the same key (e.g. `Note`, `Card`).
 *
 *  Example: a simple component you can use as `<Highlight>text</Highlight>`:
 *
 *    import type { ReactNode } from 'react'
 *
 *    function Highlight({ children }: { children: ReactNode }) {
 *      return (
 *        <mark className="rounded bg-accent/15 px-1 text-foreground">{children}</mark>
 *      )
 *    }
 *
 *    export const customComponents: MDXComponents = {
 *      Highlight,
 *    }
 *
 *  Components can be server or client components, import anything, and take
 *  props from MDX (`<PricingTable plan="pro" />`). See
 *  `src/components/mdx/rich-content.tsx` for how the built-ins are written.
 */
export const customComponents: MDXComponents = {
  ToolLink,
}
