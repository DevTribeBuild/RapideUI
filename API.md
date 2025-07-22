# API Features Yet To Be Implemented on Frontend

Based on the existing GraphQL queries and mutations in `src/graphql/queries.ts` and `src/graphql.ts`, and considering common frontend application features, the following API functionalities appear to be missing or could be further enhanced for full integration:

## Missing or Potentially Missing Queries and Mutations:

### Comprehensive Search and Filtering
*   **Description:** While product filtering exists, more generic or specific search/filter capabilities across other entities (e.g., users, transactions with advanced criteria) might be needed.
*   **Example Missing:**
    *   `SearchAllEntitiesQuery`
    *   `AdvancedUserFilterQuery`

### Full User Profile Management
*   **Description:** `UpdateUserMutation` is present, but explicit mutations for password changes, adding/updating/deleting user addresses, or managing other detailed profile settings are not explicitly defined.
*   **Example Missing:**
    *   `ChangePasswordMutation`
    *   `AddUserAddressMutation`
    *   `UpdateUserAddressMutation`
    *   `DeleteUserAddressMutation`

### In-App Notification System
*   **Description:** There are no GraphQL operations for fetching user notifications or managing their status (e.g., marking as read, deleting).
*   **Example Missing:**
    *   `GetNotificationsQuery`
    *   `MarkNotificationAsReadMutation`
    *   `DeleteNotificationMutation`

### Advanced Analytics/Reporting
*   **Description:** While raw data queries are available, there are no explicit queries for aggregated analytics or reporting (e.g., total sales by category, user activity reports).
*   **Example Missing:**
    *   `GetSalesByCategoryReportQuery`
    *   `GetUserActivityReportQuery`

### Real-time Features
*   **Description:** No GraphQL Subscriptions are present for real-time updates (e.g., live order tracking, new messages, live balance updates).
*   **Example Missing:**
    *   `OnNewOrderSubscription`
    *   `OnBalanceUpdateSubscription`

### Wishlist/Favorites
*   **Description:** No GraphQL operations to manage a user's wishlist or favorite items.
*   **Example Missing:**
    *   `GetWishlistQuery`
    *   `AddToWishlistMutation`
    *   `RemoveFromWishlistMutation`

### Product Reviews/Ratings
*   **Description:** No GraphQL operations to fetch or submit product reviews and ratings.
*   **Example Missing:**
    *   `GetProductReviewsQuery`
    *   `SubmitProductReviewMutation`
