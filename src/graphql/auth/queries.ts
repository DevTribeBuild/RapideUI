import { gql } from '@apollo/client';

export const ME_QUERY = gql`
   query Me {
     me {
       id
       email
       username
       firstName
       lastName
       imageUrl
       phone
       userType
       createdAt
       updatedAt
       fiatWallet {
         id
         balance
         createdAt
         updatedAt
         Currency {
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
       cryptoWallet {
         id
         createdAt
         updatednAt
         accounts {
           id
           cryptoWalletId
           address
           createdAt
           updatedAt
         }
       }
     }
   }
 `;
