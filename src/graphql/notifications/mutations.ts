import { gql } from '@apollo/client';

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($input: MarkAsReadInput!) {
    markNotificationAsRead(input: $input)
  }
`;
