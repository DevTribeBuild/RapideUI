import { gql } from '@apollo/client';

export const PRODUCT_QUERY = gql`
   query Product($id: String!) {
     product(id: $id) {
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

export const PRODUCTS_BY_MERCHANT_QUERY = gql`
   query ProductsByMerchant($merchantId: String!) {
     productsByMerchant(merchantId: $merchantId) {
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

export const ALL_PRODUCTS_QUERY = gql`
   query AllProducts($filters: ProductFiltersInput) {
     allProducts(filters: $filters) {
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
