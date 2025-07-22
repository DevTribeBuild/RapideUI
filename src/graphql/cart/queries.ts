import { gql } from '@apollo/client';

export const MY_CART_QUERY = gql`
   query MyCart {
     myCart {
       id
       userId
       total
       createdAt
       updatedAt
       items {
         quantity
         product {
           id
           name
           description
           quantity
           price
           imageUrl
           merchantId
           currencyId
           categoryId
           createdAt
           updatedAt
         }
       }
     }
   }
 `;
