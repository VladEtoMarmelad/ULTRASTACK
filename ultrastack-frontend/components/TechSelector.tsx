"use client";

import { useRouter } from "next/navigation";
import { TechMetadata } from "@/types/TechMetadata";

interface TechSelectorProps {
  allTech: TechMetadata[];
  currentId: string
}

export const TechSelector = ({ allTech, currentId }: TechSelectorProps) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    // Update the URL with router.push (without reloading the page)
    router.push(`?tech=${selectedId}`);
  };

  return (
    <select
      value={currentId}
      onChange={handleChange}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
    >
      {allTech.map((tech) => (
        <option key={tech.id} value={tech.id}>
          {tech.name}
        </option>
      ))}
    </select>
  );
}