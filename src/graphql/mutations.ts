import { gql } from "@apollo/client";

export const VERIFY_RIDER_MUTATION = gql`
  mutation VerifyRider($input: RiderVerificationInput!) {
    verifyRider(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_MOTORBIKE_CC_MUTATION = gql`
  mutation UpdateMotorbikeCC($id: ID!, $motorbikeCC: Int!) {
    updateMotorbikeCC(id: $id, motorbikeCC: $motorbikeCC) {
      success
      message
    }
  }
`;

// Define input types if they are not defined globally in your GraphQL schema
// input RiderVerificationInput {
//   nationalIdOrPassportUrl: String!
//   driverLicenseUrl: String!
//   logbookUrl: String!
//   certificateOfGoodConductUrl: String!
//   insuranceUrl: String!
//   motorbikeCC: Int!
// }