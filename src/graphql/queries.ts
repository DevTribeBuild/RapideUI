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