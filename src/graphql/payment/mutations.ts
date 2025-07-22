import { gql } from "@apollo/client";

export const CREATE_PAYMENT_MUTATION = gql`
   mutation CreatePayment($input: CreatePaymentInput!) {
     createPayment(input: $input) {
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
