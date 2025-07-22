import { gql } from '@apollo/client';

export const GET_CRYPTO_BALANCE = gql`
query Balances($isTest: Boolean!) {
  balances(isTest: $isTest) {
    amount
    symbol
  }
}
`

export const GET_TOTAL_CRYPTO_BALANCE = gql`
query totalCryptoBalance($isTest: Boolean!) {
  totalBalances(isTest: $isTest)
}
`

export const BALANCES_QUERY = gql`
   query Balances($isTest: Boolean = false) {
     balances(isTest: $isTest) {
       symbol
       amount
       usdValue
       price
       percentChange24h
       name
     }
   }
 `;
 
 export const TOTAL_BALANCES_QUERY = gql`
   query TotalBalances($isTest: Boolean = false) {
     totalBalances(isTest: $isTest)
   }
 `;
 
 export const MY_CRYPTO_TRANSACTIONS_QUERY = gql`
   query MyCryptoTransactions(
     $isTest: Boolean = false
     $skip: Float = 0
     $take: Float = 10
   ) {
     myCryptoTransactions(isTest: $isTest, skip: $skip, take: $take) {
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
 `;
 
 export const CRYPTO_TRANSACTIONS_BY_STATUS_QUERY = gql`
   query CryptoTransactionsByStatus(
     $status: TransactionStatus!
     $isTest: Boolean = false
     $skip: Float = 0
     $take: Float = 10
   ) {
     cryptoTransactionsByStatus(
       status: $status
       isTest: $isTest
       skip: $skip
       take: $take
     ) {
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
 `;
 
 export const CRYPTO_TRANSACTIONS_BY_TYPE_QUERY = gql`
   query CryptoTransactionsByType(
     $type: TransactionType!
     $isTest: Boolean = false
     $skip: Float = 0
     $take: Float = 10
   ) {
     cryptoTransactionsByType(
       type: $type
       isTest: $isTest
       skip: $skip
       take: $take
     ) {
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
 `;

 export const CRYPTO_TRANSACTIONS_BY_TOKEN_SYMBOL_QUERY = gql`
   query CryptoTransactionsByTokenSymbol(
     $tokenSymbol: String!
     $isTest: Boolean = false
     $skip: Float = 0
     $take: Float = 10
   ) {
     cryptoTransactionsByTokenSymbol(
       tokenSymbol: $tokenSymbol
       isTest: $isTest
       skip: $skip
       take: $take
     ) {
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
 `;
 
 export const ALL_CRYPTO_TRANSACTIONS_QUERY = gql`
   query AllCryptoTransactions($skip: Float = 0, $take: Float = 10) {
     allCryptoTransactions(skip: $skip, take: $take) {
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
 `;
 
 export const CRYPTO_TRANSACTIONS_BY_TYPE_ADMIN_QUERY = gql`
   query CryptoTransactionsByTypeAdmin(
     $type: TransactionType!
     $skip: Float = 0
     $take: Float = 10
   ) {
     cryptoTransactionsByTypeAdmin(type: $type, skip: $skip, take: $take) {
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
 `;
