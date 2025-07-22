import { gql } from '@apollo/client';

export const GET_PAYMENT_QUERY = gql`
   query GetPayment($paymentId: String!) {
     getPayment(paymentId: $paymentId) {
       id
       orderId
       amount
       method
       status
       createdAt
       updatedAt
     }
   }
 `;
 
 export const MY_PAYMENTS_QUERY = gql`
   query MyPayments {
     myPayments {
       id
       orderId
       amount
       method
       status
       createdAt
       updatedAt
     }
   }
 `;
 
 export const ADMIN_PAYMENTS_QUERY = gql`
   query AdminPayments($userId: String, $method: String) {
     adminPayments(userId: $userId, method: $method) {
       id
       orderId
       amount
       method
       status
       createdAt
       updatedAt
     }
   }
 `;
