import { gql } from '@apollo/client';

export const GET_USER_BY_EMAIL = gql`
    query getUserByEmail($email: String!) {
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
    query getAllUsers {
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
  query getCurrentUSser {
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

export const GET_FIAT_BALANCE = gql`
query fiatBalance {
  fiatWalletBalance
}
`

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

export const GET_FIAT_CURRENCIES  = gql`
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