import { gql } from "@apollo/client";

export const ASSIGN_RIDER_MUTATION = gql`
   mutation AssignRider($orderId: String!, $riderId: String!) {
     assignRider(orderId: $orderId, riderId: $riderId) {
       id
       status
       deliveryAddress
       notes
       assignedRiderId
       createdAt
       updatedAt
       cart {
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
   }
 `;

export const UPDATE_ORDER_STATUS_MUTATION = gql`
   mutation UpdateOrderStatus($orderId: String!, $status: String!) {
     updateOrderStatus(orderId: $orderId, status: $status) {
       id
       status
       deliveryAddress
       notes
       assignedRiderId
       createdAt
       updatedAt
       cart {
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
   }
 `;

export const CREATE_ORDER_MUTATION = gql`
   mutation CreateOrder($input: CreateOrderInput!) {
     createOrder(input: $input) {
       id
       status
       deliveryAddress
       notes
       assignedRiderId
       createdAt
       updatedAt
       cart {
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
   }
 `;
