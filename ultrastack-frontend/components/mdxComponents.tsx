import { CustomLink } from "./index";

export const mdxComponents = {
  h1: (props: any) => (
    <h1 {...props} className="w-full text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50" />
  ),
  p: (props: any) => (
    <p {...props} className="w-full text-lg leading-8 text-zinc-600 dark:text-zinc-400" />
  ),
  a: CustomLink,
  // You can add other components here, such as buttons.
};