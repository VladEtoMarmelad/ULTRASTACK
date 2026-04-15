import { gql } from "@apollo/client";

// GraphQL Fragments allow for reusable field selections across different operations
export const ITEM_FIELDS = gql`
  fragment ItemFields on Item {
    id
    name
    description
  }
`;

export const GET_ITEMS = gql`
  query GetItems {
    items {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

export const GET_ITEM = gql`
  query GetItem($id: ID!) {
    item(id: $id) { 
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

export const CREATE_ITEM = gql`
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
export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String) {
    updateItem(updateItemInput: { id: $id, name: $name }) {
      ...ItemFields
    }
  }
  ${ITEM_FIELDS}
`;

export const REMOVE_ITEM = gql`
  mutation RemoveItem($id: ID!) {
    removeItem(id: $id)
  }
`;