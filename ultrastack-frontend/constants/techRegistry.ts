import { 
  MongodbTech, NextjsTech, NextNavigationTech, 
  PostgresdbTech, WebsocketTech, ReduxTechProvider, 
  GraphqlTechProvider
} from "@/components/techPages";

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
  },
  {
    id: "mongodb",
    name: "MongoDB API",
    description: "Example of fetching data from a MongoDB(NoSQL) API with various HTTP methods",
  },
  {
    id: "postgresdb",
    name: "PostgreSQL API",
    description: "Example of fetching data from a PostgreSQL(SQL) API with various HTTP methods",
  },
  {
    id: "websocket",
    name: "WebSocket",
    description: "Example of real-time data streaming using WebSockets",
  },
  {
    id: "redux",
    name: "Redux Toolkit",
    description: "Example of global state management and async logic with Redux Toolkit",
  },
  {
    id: "graphql",
    name: "GraphQL & Apollo",
    description: "Example of type-safe API interactions using Apollo Client hooks and fragments",
  },
];

/**
 * Mapping of IDs to React Components. 
 * This stays on the server or is used only for rendering, never passed to Client Components.
 */
const COMPONENT_MAP: Record<string, React.ComponentType> = {
  nextjs: NextjsTech,
  nextNavigation: NextNavigationTech,
  mongodb: MongodbTech,
  postgresdb: PostgresdbTech,
  websocket: WebsocketTech,
  redux: ReduxTechProvider,
  graphql: GraphqlTechProvider,
};

export const getAllTechMetadata = async () => TECH_METADATA;

export const getTechContent = async (id: string) => {
  const meta = TECH_METADATA.find((t) => t.id === id);
  const Component = COMPONENT_MAP[id];

  if (!meta || !Component) return null;

  return { ...meta, Component };
};