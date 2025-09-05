import { gql } from "@apollo/client";

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

export const UPDATE_RIDER_DETAILS_MUTATION = gql`
  mutation UpdateRiderDetails($updateRiderDetailsInput: UpdateRiderDetailsInput!) {
    updateRiderDetails(updateRiderDetailsInput: $updateRiderDetailsInput) {
      id
      firstName
      lastName
      photoUrl
      idNumber
      licenseNumber
      vehicleType
      status
      createdAt
      updatedAt
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
  smartphoneType: String
}
*/