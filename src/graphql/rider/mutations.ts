
import { gql } from '@apollo/client';

export const UPDATE_RIDER_LOCATION = gql`
  mutation UpdateRiderLocation($lat: Float!, $lng: Float!) {
    updateRiderLocation(lat: $lat, lng: $lng) {
      id
      lat
      lng
    }
  }
`;

export const CONFIRM_ORDER_BY_RIDER = gql`
  mutation ConfirmOrderByRider($orderId: String!) {
    confirmOrderByRider(orderId: $orderId) {
      id
      status
      total
      notes
      deliveryAddress
      deliveryLat
      deliveryLng
      createdAt
      updatedAt
      assignedRider {
        id
        firstName
        lastName
        email
        phone
        username
        userType
        imageUrl
        walletAddress
        currencyId
        createdAt
        updatedAt
      }
      payment {
        id
        orderId
        amount
        method
        status
        transactionHash
        createdAt
        updatedAt
      }
    }
  }
`;

