import { gql } from '@apollo/client';

export const GET_USER_BY_EMAIL = gql`
    query Query($email: String!) {
        user(email: $email) {
            createdAt
            email
            id
            updatedAt
            walletAddress
            userType
        }
    }
`;

export const GET_ALL_USERS = gql`
    query Query {
        users {
            createdAt
            email
            id
            updatedAt
            userType
            walletAddress
        }
    }
`;

export const GET_ME = gql`
  query {
    me {
      id
      email
      firstName
      lastName
      username
      createdAt
      updatedAt
      fiatWallet {
        id
        balance
        createdAt
        updatedAt
        Currency {
          createdAt
          code
          name
          rateToUSD
          symbol
        }
      }
      cryptoWallet {
        accounts {
          id
          address
          cryptoWalletId
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const GET_MY_TRANSACTIONS = gql`
query Query($isTest: Boolean!, $skip: Float!, $take: Float!) {
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
query Query($skip: Float!, $status: TransactionStatus, $take: Float!) {
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

export const GET_FIAT_BALANCE = gql`
query Query {
  fiatWalletBalance
}
`