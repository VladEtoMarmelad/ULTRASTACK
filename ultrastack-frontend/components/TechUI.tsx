import { CustomLink, ApiData } from "./index";

/**
 * These components replicate the styling previously applied via mdxComponents.
 * They ensure visual consistency across all tech-specific pages.
 */
export const TechUI = {
  H1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="w-full text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50" />
  ),
  H3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-xl font-bold mt-6 mb-2" />
  ),
  P: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="w-full text-lg leading-8 text-zinc-600 dark:text-zinc-400" />
  ),
  A: CustomLink,
  ApiData
};