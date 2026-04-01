import { getAllTechMetadata, getTechContent } from "@/constants/techRegistry";
import { redirect } from "next/navigation";
import { TechSelector, TechUI } from "@/components/index";

export default async function Home({ searchParams }: { searchParams: Promise<{ tech?: string }> }) {
  const params = await searchParams;
  const allTech = await getAllTechMetadata();
  const currentTechId = params.tech || allTech[0].id;
  const techData = await getTechContent(currentTechId);

  if (!techData) redirect("/");

  /**
   * We extract the Component from our techData.
   * Since it's a standard React component, we can render it directly.
   */
  const ContentComponent = techData.Component;

  return (
    <div className="flex flex-col flex-1 font-sans">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            {techData.name}
          </h2>
        </div>

        <TechSelector allTech={allTech} currentId={currentTechId} />
      </header>

      <main className="flex flex-1 w-full flex-col items-stretch justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-start gap-6 text-left w-full">
          <TechUI.H1>{techData.description}</TechUI.H1>
          <ContentComponent />
        </div>
      </main>
    </div>
  );
}