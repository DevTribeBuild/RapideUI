import { gql } from "@apollo/client";

export const GET_MY_RIDER_DETAILS_QUERY = gql`
  query GetMyRiderDetails($userId: String!) {
    riderDetails(userId: $userId) {
      id
      userId
      status
      nationalIdOrPassport
      driverLicense
      logbook
      certificateOfGoodConduct
      insurance
    }
  }
`;

export const GET_RIDERS_BY_STATUS_QUERY = gql`
  query GetRidersByStatus($status: RiderStatus!) {
    ridersByStatus(status: $status) {
      id
      userId
      status
      nationalIdOrPassport
      driverLicense
      logbook
      certificateOfGoodConduct
      insurance
    }
  }
`;