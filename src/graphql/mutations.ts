import { gql } from "@apollo/client";

export const UPLOAD_NATIONAL_ID_OR_PASSPORT_MUTATION = gql`
  mutation UploadNationalIdOrPassport($file: Upload!) {
    uploadNationalIdOrPassport(file: $file) {
      success
      message
      url
    }
  }
`;

export const UPLOAD_DRIVER_LICENSE_MUTATION = gql`
  mutation UploadDriverLicense($file: Upload!) {
    uploadDriverLicense(file: $file) {
      success
      message
      url
    }
  }
`;

export const UPLOAD_LOGBOOK_MUTATION = gql`
  mutation UploadLogbook($file: Upload!) {
    uploadLogbook(file: $file) {
      success
      message
      url
    }
  }
`;

export const UPLOAD_CERTIFICATE_OF_GOOD_CONDUCT_MUTATION = gql`
  mutation UploadCertificateOfGoodConduct($file: Upload!) {
    uploadCertificateOfGoodConduct(file: $file) {
      success
      message
      url
    }
  }
`;

export const UPLOAD_INSURANCE_MUTATION = gql`
  mutation UploadInsurance($file: Upload!) {
    uploadInsurance(file: $file) {
      success
      message
      url
    }
  }
`;

export const UPSERT_RIDER_DETAILS_MUTATION = gql`
  mutation UpsertMyRiderDetails($userId: String!, $input: RiderDetailsInput!) {
    upsertRiderDetails(userId: $userId, input: $input) {
      id
      userId
      status
    }
  }
`;

export const APPROVE_RIDER_MUTATION = gql`
  mutation ApproveRider($userId: String!) {
    approveRider(userId: $userId) {
      id
      userId
      status
    }
  }
`;

export const REJECT_RIDER_MUTATION = gql`
  mutation RejectRider($userId: String!) {
    rejectRider(userId: $userId) {
      id
      userId
      status
    }
  }
`;

// Input types (assuming they are not globally defined in your GraphQL schema)
// These should ideally be defined in your GraphQL schema file (.graphql or .gql)
// For frontend typing purposes, we define them here.

/*
input RiderDetailsInput {
  nationalIdOrPassport: String
  driverLicense: String
  logbook: String
  certificateOfGoodConduct: String
  insurance: String
  motorbikeCC: Int
}
*/