import { gql } from '@apollo/client';

export const GET_MY_TRANSACTIONS = gql`
query getMyTransactions($isTest: Boolean!, $skip: Float!, $take: Float!) {
  myCryptoTransactions(isTest: $isTest, skip: $skip, take: $take) {
    blockNumber
    confirmations
    createdAt
    errorMessage
    fee
    from
    gas
    gasPrice
    gasUsed
    hash
    id
    methodId
    status
    timeStamp
    to
    toSymbol
    tokenAddress
    tokenSymbol
    transactionIndex
    txreceipt_status
    type
    updatedAt
    userId
    value
  }
}`;


export const GET_ALL_TRANSACTIONS = gql`
query allCryptoTransactions($skip: Float!, $status: TransactionStatus, $take: Float!) {
  allCryptoTransactions(skip: $skip, status: $status, take: $take) {
    blockNumber
    confirmations
    createdAt
    errorMessage
    fee
    from
    gas
    gasPrice
    gasUsed
    hash
    id
    methodId
    status
    timeStamp
    to
    toSymbol
    tokenAddress
    tokenSymbol
    transactionIndex
    txreceipt_status
    type
    updatedAt
    userId
    value
  }
}`;

export const GET_MY_TRANSACTIONS_COMBINED = gql`
query TransactionsHistory($type: String) {
  transactionsHistory(type: $type) {
    fiat {
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
    crypto {
      blockNumber
      confirmations
      createdAt
      errorMessage
      fee
      from
      gas
      gasPrice
      gasUsed
      hash
      id
      methodId
      status
      timeStamp
      to
      toSymbol
      tokenAddress
      tokenSymbol
      transactionIndex
      txreceipt_status
      type
      updatedAt
      userId
      value
    }
  }
}`

export const TRANSACTIONS_HISTORY_QUERY = gql`
   query TransactionsHistory($type: String = "ALL") {
     transactionsHistory(type: $type) {
       fiat {
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
       crypto {
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
