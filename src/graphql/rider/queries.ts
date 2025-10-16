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

export const GET_RIDER_ORDERS_QUERY = gql`
  query GetRiderOrders {
    getRiderOrders {
      assignedRiderId
      cart {
        createdAt
        id
        items {
          createdAt
          id
          product {
            categoryId
            createdAt
            currencyId
            description
            id
            imageUrl
            merchantId
            name
            price
            quantity
            updatedAt
          }
          quantity
          updatedAt
        }
        total
        updatedAt
      }
      createdAt
      deliveryAddress
      deliveryLat
      deliveryLng
      id
      merchant {
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
      notes
      payment {
        amount
        createdAt
        id
        method
        orderId
        status
        transactionHash
        updatedAt
      }
      status
      total
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
    }
  }
`;
