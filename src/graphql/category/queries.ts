import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
query AllCategories {
  allCategories {
    createdAt
    id
    name
    parentId
    subcategories {
      createdAt
      id
      name
      parentId
      updatedAt
    }
    updatedAt
  }
}`

export const CATEGORY_QUERY = gql`
   query Category($id: String!) {
     category(id: $id) {
       id
       name
       parentId
       createdAt
       updatedAt
       subcategories {
         id
         name
         parentId
         createdAt
         updatedAt
       }
     }
   }
 `;

export const ALL_CATEGORIES_QUERY = gql`
query AllCategories {
  allCategories {
    createdAt
    id
    name
    parentId
    subcategories {
      createdAt
      id
      name
      parentId
      subcategories {
        name
      }
      updatedAt
    }
    updatedAt
  }
}`;

