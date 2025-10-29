import { gql } from '@apollo/client';

export const UPLOAD_BANK_CONFIRMATION = gql`
  mutation UploadBankConfirmation($file: Upload!) {
    uploadBankConfirmation(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_CR12_FORM = gql`
  mutation UploadCR12Form($file: Upload!) {
    uploadCR12Form(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_CERTIFICATE_OF_INCORPORATION = gql`
  mutation UploadCertificateOfIncorporation($file: Upload!) {
    uploadCertificateOfIncorporation(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_FOOD_HANDLER_CERT = gql`
  mutation UploadFoodHandlerCert($file: Upload!) {
    uploadFoodHandlerCert(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_HEALTH_CERT = gql`
  mutation UploadHealthCert($file: Upload!) {
    uploadHealthCert(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_KRA_PIN_CERTIFICATE = gql`
  mutation UploadKraPinCertificate($file: Upload!) {
    uploadKraPinCertificate(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_MENU_FILE = gql`
  mutation UploadMenuFile($file: Upload!) {
    uploadMenuFile(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_MENU_IMAGE = gql`
  mutation UploadMenuImage($file: Upload!) {
    uploadMenuImage(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_TRADING_LICENSE = gql`
  mutation UploadTradingLicense($file: Upload!) {
    uploadTradingLicense(file: $file) {
      message
      success
      url
    }
  }
`;

export const UPLOAD_OWNER_KRA_PIN_CERTIFICATE = gql`
    mutation UploadOwnerKraPinCertificate($file: Upload!) {
        uploadOwnerKraPinCertificate(file: $file) {
            message
            success
            url
        }
    }
`;

export const UPDATE_MERCHANT_DETAILS = gql`
  mutation UpdateMerchantDetails($input: UpdateMerchantDetailsInput!) {
    updateMerchantDetails(input: $input) {
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
    }
  }
`;

export const CREATE_MERCHANT_MUTATION = gql`
  mutation CreateMerchant($input: CreateMerchantInput!) {
    createMerchant(input: $input) {
      id
      businessName
      user {
        email
      }
      status
    }
  }
`;

export const UPDATE_MERCHANT_MUTATION = gql`
  mutation UpdateMerchant($input: UpdateMerchantInput!) {
    updateMerchant(input: $input) {
      id
      businessName
      user {
        email
      }
      status
    }
  }
`;

export const DELETE_MERCHANT_MUTATION = gql`
  mutation DeleteMerchant($id: ID!) {
    deleteMerchant(id: $id) {
      message
      success
    }
  }
`;

export const VERIFY_MERCHANT_MUTATION = gql`
  mutation VerifyMerchant($id: ID!, $status: String!) {
    verifyMerchant(id: $id, status: $status) {
      id
      businessName
      status
    }
  }
`;