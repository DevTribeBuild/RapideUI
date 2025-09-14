import { gql } from '@apollo/client';

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications($filter: GetNotificationsInput!) {
    getMyNotifications(filter: $filter) {
      notifications {
        body
        category
        createdAt
        externalError
        id
        message
        readAt
        status
        title
        type
      }
      totalCount
    }
  }
`;
