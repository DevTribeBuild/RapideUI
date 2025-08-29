import { gql } from "@apollo/client";

export const GET_ALL_RIDERS = gql`
  query AllRiderDetails {
    allRiderDetails {
      certificateOfGoodConduct
      createdAt
      driverLicense
      id
      insurance
      logbook
      motorbikeCC
      nationalIdOrPassport
      smartphoneType
      status
      updatedAt
      user {
        createdAt
        email
        firstName
        id
        imageUrl
        lastName
        phone
        updatedAt
        userType
        username
      }
      userId
    }
  }
`;

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