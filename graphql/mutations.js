import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($loginRequest: LoginRequestDTO!) {
    login(loginRequest: $loginRequest) {
      msg
      status
      user {
        email
        id
      }
      token
    }
  }
`;