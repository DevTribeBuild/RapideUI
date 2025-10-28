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

export const FIND_ALL_USERS_QUERY = gql`
   query FindAllUsers {
     users {
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
 
 export const FIND_ONE_USER_QUERY = gql`
   query FindOneUser($email: String!) {
     user(email: $email) {
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

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      firstName
      lastName
      username
      phone
      email
    }
  }
`;
