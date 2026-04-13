"use client";

import { TechUI } from "../TechUI";
import { GraphqlApiData } from "../GraphqlApiData";
import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

/**
 * GraphQL Fragments allow for reusable field selections across different operations.
 */
const ITEM_FIELDS = gql`
  fragment ItemFields on Item {
    id
    name
    description
  }
`;

const GET_ITEMS = gql`
  query GetItems {
    items {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

const CREATE_ITEM = gql`
  mutation CreateItem($name: String!, $description: String!) {
    createItem(createItemInput: { name: $name, description: $description }) {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

/**
 * Updated $id type to ID! to support large integer values (like timestamps) 
 * that exceed the 32-bit limit of the standard Int type.
 */
const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String) {
    updateItem(updateItemInput: { id: $id, name: $name }) {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

const REMOVE_ITEM = gql`
  mutation RemoveItem($id: ID!) {
    removeItem(id: $id)
  }
`;

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:3030/graphql",
  }),
});

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
      refetchQueries={[{ query: GET_ITEMS }]}
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