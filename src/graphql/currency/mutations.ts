import { gql } from "@apollo/client";

export const CREATE_CURRENCY_MUTATION = gql`
   mutation CreateCurrency($input: CreateCurrencyInput!) {
     createCurrency(input: $input) {
       id
       code
       name
       symbol
       rateToUSD
       decimals
       createdAt
       updatedAt
     }
   }
 `;
 
 export const UPDATE_CURRENCY_MUTATION = gql`
   mutation UpdateCurrency($input: UpdateCurrencyInput!) {
     updateCurrency(input: $input) {
       id
       code
       name
       symbol
       rateToUSD
       decimals
       createdAt
       updatedAt
     }
   }
 `;
 
 export const DELETE_CURRENCY_MUTATION = gql`
   mutation DeleteCurrency($id: String!) {
     deleteCurrency(id: $id) {
       id
       code
       name
       symbol
       rateToUSD
       decimals
       createdAt
       updatedAt
     }
   }
 `;
