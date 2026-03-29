import { NextjsTech, NextNavigationTech } from "@/components/techPages";

// Serializable metadata to be passed to Client Components like TechSelector.

export const TECH_METADATA = [
  {
    id: "nextjs",
    name: "Next.js Core",
    description: "The React Framework for the Web",
  },
  {
    id: "nextNavigation",
    name: "Next Navigation",
    description: "Example of using Nextjs Navigation to navigate between pages",
  }
];

/**
 * Mapping of IDs to React Components. 
 * This stays on the server or is used only for rendering, never passed to Client Components.
 */
const COMPONENT_MAP: Record<string, React.ComponentType> = {
  nextjs: NextjsTech,
  nextNavigation: NextNavigationTech,
};

export const getAllTechMetadata = async () => TECH_METADATA;

export const getTechContent = async (id: string) => {
  const meta = TECH_METADATA.find((t) => t.id === id);
  const Component = COMPONENT_MAP[id];

  if (!meta || !Component) return null;

  return { ...meta, Component };
};