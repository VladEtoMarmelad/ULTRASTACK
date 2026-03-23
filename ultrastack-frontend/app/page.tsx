import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllTechMetadata, getTechContent } from "@/utils/mdx";
import { redirect } from "next/navigation";
import { TechSelector, CustomLink } from "@/components/index";

const mdxComponents = {
  h1: (props: any) => (
    <h1 {...props} className="w-full text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50" />
  ),
  p: (props: any) => (
    <p {...props} className="w-full text-lg leading-8 text-zinc-600 dark:text-zinc-400" />
  ),
  a: CustomLink,
  // You can add other components here, such as buttons.
};

export default async function Home({ searchParams }: { searchParams: Promise<{ tech?: string }> }) {
  const params = await searchParams;
  const allTech = await getAllTechMetadata();
  const currentTechId = params.tech || allTech[0].id;
  const techData = await getTechContent(currentTechId);

  if (!techData) redirect("/");

  return (
    <div className="flex flex-col flex-1 font-sans">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            {techData.meta.name}
          </h2>
        </div>

        <TechSelector allTech={allTech} currentId={currentTechId} />
      </header>

      <main className="flex flex-1 w-full flex-col items-stretch justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-start gap-6 text-left w-full">
          <MDXRemote source={techData.content} components={mdxComponents} />
        </div>
      </main>
    </div>
  );
}