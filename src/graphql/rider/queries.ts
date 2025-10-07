import { gql } from '@apollo/client';

export const RIDER_DETAILS = gql`
  query RiderDetails($userId: String!) {
    riderDetails(userId: $userId) {
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
    }
  }
`;