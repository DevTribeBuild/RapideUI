import { gql } from "@apollo/client";

export const SEND_TOKEN = gql`
  mutation SendToken($input: SendTokenInput!) {
    sendToken(input: $input) {
      message
      status
      transactionHash
    }
  }
`;

export const SWAP_TOKEN_MUTATION = gql`
   mutation SwapToken($input: SwapTokenInput!) {
     swapToken(input: $input) {
       status
       message
       transactionHash
       transaction {
         id
         userId
         hash
         blockNumber
         timeStamp
         from
         to
         value
         gas
         gasPrice
         txreceipt_status
         methodId
         tokenAddress
         tokenSymbol
         toSymbol
         status
         type
         confirmations
         fee
         transactionIndex
         gasUsed
         errorMessage
         createdAt
         updatedAt
       }
     }
   }
 `;
 
 export const WITHDRAW_MUTATION = gql`
   mutation Withdraw($input: WithdrawTokenInput!) {
     withdraw(input: $input) {
       message
       status
       transactionHash
       transaction {
         id
         userId
         hash
         blockNumber
         timeStamp
         from
         to
         value
         gas
         gasPrice
         txreceipt_status
         methodId
         tokenAddress
         tokenSymbol
         toSymbol
         status
         type
         confirmations
         fee
         transactionIndex
         gasUsed
         errorMessage
         createdAt
         updatedAt
       }
     }
   }
 `;
