/**
 * Single source of truth for the site's <title>.
 *
 * Per-page overrides go through the `<Seo />` component or the `seo` prop on
 * `<Page />`. The static fallback in `src/client/index.html` should mirror
 * `siteName` so non-JS crawlers and the first paint show the right title.
 */

export interface SeoConfig {
  siteName: string;
  /** Renders the final <title>. Receives the per-page title (if any). */
  formatTitle: (title?: string) => string;
}

// TODO: This is a placeholder, change to the name of your project once known
const siteName = 'Empty Project';

export const seoConfig: SeoConfig = {
  siteName,
  formatTitle: (title) => (title ? `${title} · ${siteName}` : siteName),
};
