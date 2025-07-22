import { gql } from "@apollo/client";

export const CREATE_PRODUCT_MUTATION = gql`
   mutation CreateProduct($input: CreateProductInput!) {
     createProduct(input: $input) {
       id
       name
       description
       price
       imageUrl
       merchantId
       currencyId
       categoryId
       quantity
       createdAt
       updatedAt
     }
   }
 `;
 
 export const UPDATE_PRODUCT_MUTATION = gql`
   mutation UpdateProduct($input: UpdateProductInput!) {
     updateProduct(input: $input) {
       id
       name
       description
       price
       imageUrl
       merchantId
       currencyId
       categoryId
       quantity
       createdAt
       updatedAt
     }
   }
 `;
 
 export const DELETE_PRODUCT_MUTATION = gql`
   mutation DeleteProduct($id: String!) {
     deleteProduct(id: $id) {
       id
       name
       description
       price
       imageUrl
       merchantId
       currencyId
       categoryId
       quantity
       createdAt
       updatedAt
     }
   }
 `;
