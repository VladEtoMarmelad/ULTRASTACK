"use client";

import { TechUI } from "../TechUI";
import { GraphqlApiData } from "../GraphqlApiData";
import { ApolloProvider } from "@apollo/client/react";
import { GET_ITEMS, GET_ITEM, CREATE_ITEM, UPDATE_ITEM, REMOVE_ITEM } from "@/constants/graphqlOperations";
import { client } from "@/lib/apolloClient";

export const GraphqlTechProvider = () => {
  return (
    <ApolloProvider client={client}>
      <GraphqlTech />
    </ApolloProvider>
  )
}

export const GraphqlTech = () => (
  <>
    <TechUI.H1>GraphQL & Apollo Integration</TechUI.H1>
    <TechUI.P>
      Demonstrating type-safe API interactions using Apollo Client hooks and fragments.
    </TechUI.P>

    <TechUI.H3>Query: List All Items</TechUI.H3>
    <GraphqlApiData 
      query={GET_ITEMS} 
      operationName="Run Query: getItems" 
    />

    <TechUI.H3>Query: Get Single Item</TechUI.H3>
    <GraphqlApiData 
      query={GET_ITEM} 
      operationName="Run Query: getItem" 
      /**
       * fetchPolicy: "network-only" ensures we bypass the cache when looking for 
       * a specific item, preventing us from finding items that were deleted on the server.
       */
      fetchPolicy="network-only"
      fields={[
        /**
         * Changed type to "text" because GraphQL ID types are sent as strings 
         * to avoid precision loss with large numbers.
         */
        { key: "id", label: "Item ID", type: "text", location: "body" }
      ]}
    />

    <TechUI.H3>Mutation: Create New Item</TechUI.H3>
    <GraphqlApiData 
      mutation={CREATE_ITEM}
      operationName="Run Mutation: createItem"
      /**
       * Tell Apollo to re-run GET_ITEMS query after creating a new item
       * to refresh the local cache and update the UI.
       */
      refetchQueries={[{ query: GET_ITEMS }]}
      fields={[
        { key: "name", label: "Name", placeholder: "Item name...", location: "body" },
        { key: "description", label: "Description", placeholder: "Item description...", location: "body" }
      ]}
    />

    <TechUI.H3>Mutation: Update with Variables</TechUI.H3>
    <GraphqlApiData 
      mutation={UPDATE_ITEM}
      operationName="Run Mutation: updateItem"
      /**
       * Ensure the item list is updated in case item names changed.
       */
      refetchQueries={[{ query: GET_ITEMS }, { query: GET_ITEM }]} 
      fields={[
        /**
         * Changed type to "text" because GraphQL ID types are sent as strings 
         * to avoid precision loss with large numbers.
         */
        { key: "id", label: "Item ID", type: "text", location: "body" },
        { key: "name", label: "New Name", location: "body" }
      ]}
    />

    <TechUI.H3>Mutation: Remove Item</TechUI.H3>
    <GraphqlApiData 
      mutation={REMOVE_ITEM}
      operationName="Run Mutation: removeItem"
      /**
       * Ensure the item list is updated in case item names changed.
       */
      refetchQueries={[{ query: GET_ITEMS }]} 
      /**
       * The update function allows us to manually manipulate the cache.
       * cache.evict removes the object from the normalized cache entirely.
       */
      update={(cache, { data }, { variables }) => {
        if (data?.removeItem) {
          const normalizedId = cache.identify({ __typename: "Item", id: variables?.id });
          cache.evict({ id: normalizedId });
          cache.gc(); // Garbage collect to clean up orphaned references
        }
      }}
      fields={[
        /**
         * Changed type to "text" because GraphQL ID types are sent as strings 
         * to avoid precision loss with large numbers.
         */
        { key: "id", label: "Item ID", type: "text", location: "body" }
      ]}
    />
  </>
);