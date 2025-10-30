import { gql } from '@apollo/client';

export const MY_MERCHANT_DETAILS = gql`
  query MyMerchantDetails {
    myMerchantDetails {
      bankAccountNumber
      bankConfirmation
      bankName
      businessName
      certificateOfIncorp
      cr12Form
      createdAt
      foodHandlerCert
      healthCert
      id
      kraPinCert
      menuFile
      menuImages
      mpesaPaybill
      mpesaTill
      ownerKraPinCert
      status
      tradingLicense
      updatedAt
      user {
        createdAt
        currencyId
        email
        firstName
        id
        lastName
        phone
        updatedAt
        userType
        username
        walletAddress
      }
      userId
      verifiedAt
    }
  }
`;

export const GET_ALL_MERCHANTS_QUERY = gql`
  query GetAllMerchants {
    allMerchants {
      id
      businessName
      user {
        email
      }
      status
      createdAt
      updatedAt
    }
  }
`;

export const MERCHANTS_BY_STATUS_QUERY = gql`
  query MerchantsByStatus($status: VerificationStatus!) {
    merchantsByStatus(status: $status) {
      bankAccountNumber
      bankConfirmation
      bankName
      businessName
      certificateOfIncorp
      cr12Form
      createdAt
      foodHandlerCert
      healthCert
      id
      kraPinCert
      menuFile
      menuImages
      mpesaPaybill
      mpesaTill
      ownerKraPinCert
      status
      tradingLicense
      updatedAt
      userId
      verifiedAt
      user {
        email
      }
    }
  }
`;
