import { gql } from "@apollo/client";

export const ADD_TO_CART_MUTATION = gql`
   mutation AddToCart($input: CartItemInput!) {
     addToCart(input: $input) {
       userId
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
 
 export const UPDATE_CART_ITEM_MUTATION = gql`
   mutation UpdateCartItem($input: CartItemInput!) {
     updateCartItem(input: $input) {
       userId
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
 
 export const REMOVE_FROM_CART_MUTATION = gql`
   mutation RemoveFromCart($productId: String!) {
     removeFromCart(productId: $productId) {
       userId
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
 
 export const CLEAR_CART_MUTATION = gql`
   mutation ClearCart {
     clearCart {
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
