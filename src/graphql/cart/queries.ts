import { gql } from '@apollo/client';

export const MY_CART_QUERY = gql`
   query MyCart {
     myCart {
     id
     createdAt
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
         }
       }
     }
   }
 `;

