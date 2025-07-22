import { gql } from "@apollo/client";

export const REQUEST_OTP_MUTATION = gql`
  mutation RequestOtp($requestOtp: RequestOtpDTO!) {
    requestOtp(requestOtp: $requestOtp) {
      msg
      expiresAt
      status
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginRequest: LoginRequestDTO!) {
    login(loginRequest: $loginRequest) {
    expiresAt
    msg
    status
    token
    user {
      createdAt
      cryptoWallet {
        accounts {
          address
          createdAt
          cryptoWalletId
          id
          updatedAt
        }
        createdAt
        id
        updatedAt
      }
      email
      fiatWallet {
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
      }
      firstName
      id
      imageUrl
      lastName
      phone
      updatedAt
      userType
      username
      walletAddress
    }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerRequest: RegisterRequestDTO!) {
    register(registerRequest: $registerRequest) {
      expiresAt
      msg
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
    mutation VerifyOtp($email: String!, $otp: String!) {
        verifyOtp(email: $email, otp: $otp) {
            expiresAt
            msg
            status
            token
            user {
                createdAt
                email
                id
                updatedAt
                userType
                walletAddress
            }
        }
    }
`;
