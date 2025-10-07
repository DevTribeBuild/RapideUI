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
        imageUrl
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
