import { gql } from "@apollo/client";

export const CREATE_PRODUCT_CATEGORY = gql`
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    createdAt
    id
    name
    parentId
    subcategories {
      name
    }
    updatedAt
  }
}
`

export const UPDATE_CATEGORY_MUTATION = gql`
   mutation UpdateCategory($input: UpdateCategoryInput!) {
     updateCategory(input: $input) {
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
 
 export const DELETE_CATEGORY_MUTATION = gql`
   mutation DeleteCategory($id: String!) {
     deleteCategory(id: $id) {
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
