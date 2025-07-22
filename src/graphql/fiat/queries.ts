import { gql } from '@apollo/client';

export const GET_FIAT_BALANCE = gql`
query FiatWallet($fiatWalletId: String!) {
  fiatWallet(id: $fiatWalletId) {
    Currency {
      code
      createdAt
      decimals
      id
      name
      rateToUSD
      symbol
      updatedAt
    }
    balance
    createdAt
    id
    updatedAt
    userId
  }
}
`

export const GET_FIAT_WALLET_ACCOUNTS = gql`
query getFiatWalletAccounts {
  allFiatWallets {
    Currency {
      createdAt
      code
      decimals
      id
      name
      rateToUSD
      symbol
      updatedAt
    }
    balance
    createdAt
    id
    updatedAt
    userId
  }
}
`


export const FIAT_WALLET_ACCOUNTS = gql`
query getFiatWalletAccounts {
  fiatWallets {
    Currency {
      code
      createdAt
      decimals
      id
      name
      rateToUSD
      symbol
      updatedAt
    }
    balance
    createdAt
    id
    updatedAt
    userId
  }
}
`

export const GET_FIAT_CURRENCIES = gql`
query getfiatcurrencies {
  currencies {
    code
    createdAt
    decimals
    id
    name
    rateToUSD
    symbol
    updatedAt
  }
}
`

export const FIAT_TRANSACTION_HISTORY_QUERY = gql`
   query FiatTransactionHistory {
     fiatTransactionHistory {
       id
       recipientEmail
       recipientId
       senderId
       amount
       Currency {
         code
         createdAt
         decimals
         id
         name
         rateToUSD
         symbol
         updatedAt
       }
       status
       createdAt
       updatedAt
     }
   }
 `;

export const FIAT_WALLET_BALANCE_QUERY = gql`
   query FiatWalletBalance {
     fiatWalletBalance
   }
 `;


export const FIAT_WALLETS_QUERY = gql`
   query FiatWallets {
     fiatWallets {
       id
       userId
       balance
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
       createdAt
       updatedAt
     }
   }
 `;

 export const ALL_FIAT_WALLETS_QUERY = gql`
   query AllFiatWallets {
     allFiatWallets {
       id
       userId
       balance
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
       createdAt
       updatedAt
     }
   }
 `;
 
 export const MY_FIAT_WALLET_QUERY = gql`
   query MyFiatWallet {
     myFiatWallet {
       id
       userId
       balance
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
       createdAt
       updatedAt
     }
   }
 `;
