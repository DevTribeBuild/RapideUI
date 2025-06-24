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