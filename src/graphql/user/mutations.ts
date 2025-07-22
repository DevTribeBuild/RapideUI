import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      cryptoWallet {
        accounts {
          address
          createdAt
          cryptoWalletId
        }
      }
      email
      fiatWallet {
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
      }
      firstName
      id
      lastName
      username
      walletAddress
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
   mutation CreateUser($createUserInput: CreateUserInput!) {
     createUser(createUserInput: $createUserInput) {
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
       walletAddress
     }
   }
 `;
