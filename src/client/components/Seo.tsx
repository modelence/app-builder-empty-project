/**
 * Renders the document <title> using React 19's native support for `<title>`
 * inside components — React hoists it into the document <head> automatically,
 * so no provider or portal is needed.
 *
 * The title falls back to `seoConfig.siteName` (see `src/client/seo.config.ts`).
 * Use the `seo` prop on `<Page />` for per-route overrides, or render
 * `<Seo />` directly for pages that don't use `<Page />`.
 */

import { seoConfig } from '@/client/seo.config';

export interface SeoProps {
  /** Page-specific title; combined with `seoConfig.formatTitle`. */
  title?: string;
  /** When true, asks crawlers not to index/follow this page. */
  noindex?: boolean;
}

export function Seo({ title, noindex }: SeoProps) {
  return (
    <>
      <title>{seoConfig.formatTitle(title)}</title>
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}
