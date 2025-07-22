import { gql } from "@apollo/client";

export const FIAT_DEPOSIT = gql`
  mutation fiatDeposit($input: DepositFiatInput!) {
  depositFiat(input: $input) {
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
    amount
    createdAt
    id
    recipientEmail
    recipientId
    senderId
    status
    updatedAt
  }
}
`

export const INITIATE_FIAT_SEND = gql`
mutation InitiateSendFiat($input: InitiateSendFiatInput!) {
  initiateSendFiat(input: $input) {
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
    amount
    createdAt
    id
    recipientEmail
    recipientId
    senderId
    status
    updatedAt
  }
}`


export const CONFIRM_FIAT_SEND = gql`
mutation ConfirmSendFiat($input: ConfirmSendFiatInput!) {
  confirmSendFiat(input: $input) {
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
    amount
    createdAt
    id
    recipientEmail
    recipientId
    senderId
    status
    updatedAt
  }
}`

export const CREATE_FIAT_WALLET = gql`
mutation CreateMyFiatWallet($input: CreateFiatWalletInput!) {
  createMyFiatWallet(input: $input) {
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
}`

export const INITIATE_CLAIM_FIAT_MUTATION = gql`
   mutation InitiateClaimFiat($input: InitiateClaimFiatInput!) {
     initiateClaimFiat(input: $input)
   }
 `;

export const CLAIM_FIAT_MUTATION = gql`
   mutation ClaimFiat($input: ClaimFiatInput!) {
     claimFiat(input: $input) {
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

export const REQUEST_FIAT_MUTATION = gql`
   mutation RequestFiat($input: RequestFiatInput!) {
     requestFiat(input: $input) {
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

export const INITIATE_WITHDRAW_FIAT_MUTATION = gql`
   mutation InitiateWithdrawFiat($input: WithdrawFiatInput!) {
     initiateWithdrawFiat(input: $input)
   }
 `;

export const CONFIRM_WITHDRAW_FIAT_MUTATION = gql`
   mutation ConfirmWithdrawFiat($input: ConfirmWithdrawFiatInput!) {
     confirmWithdrawFiat(input: $input) {
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
