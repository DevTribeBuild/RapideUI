import { gql } from '@apollo/client';

export const CURRENCIES_QUERY = gql`
   query Currencies {
     currencies {
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

export const CURRENCY_QUERY = gql`
   query Currency($id: String!) {
     currency(id: $id) {
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

export const CURRENCY_BY_CODE_QUERY = gql`
   query CurrencyByCode($code: String!) {
     currencyByCode(code: $code) {
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
