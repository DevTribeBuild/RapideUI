
import { gql } from '@apollo/client';

export const UPDATE_RIDER_LOCATION_MUTATION = gql`
  mutation UpdateRiderLocation($input: UpdateRiderLocationInput!) {
    updateRiderLocation(input: $input) {
      createdAt
      id
      latitude
      longitude
      orderId
      riderId
      updatedAt
    }
  }
`;
