import { gql } from '@apollo/client';

export const UNASSIGNED_ORDERS_QUERY = gql`
   query UnassignedOrders {
     unassignedOrders {
       id
       status
       deliveryAddress
       notes
       assignedRiderId
       createdAt
       updatedAt
       cart {
         id
         userId
         total
         createdAt
         updatedAt
         items {
           quantity
           product {
             id
             name
             description
             quantity
             price
             imageUrl
             merchantId
             currencyId
             categoryId
             createdAt
             updatedAt
           }
         }
       }
     }
   }
 `;

export const GET_ORDER_QUERY = gql`
   query GetOrder($orderId: String!) {
     getOrder(orderId: $orderId) {
       id
       status
       deliveryAddress
       notes
       assignedRiderId
       createdAt
       updatedAt
       total
       payment {
         amount
         method
       }
       cart {
         id
         total
         createdAt
         updatedAt
         items {
           quantity
           product {
             id
             name
             description
             quantity
             price
             imageUrl
             merchantId
             currencyId
             categoryId
             createdAt
             updatedAt
           }
         }
       }
     }
   }
 `;
 
 export const MY_ORDERS_QUERY = gql`
  query MyOrders {
    myOrders {
      assignedRiderId
      cart {
        createdAt
        id
        items {
          createdAt
          id
          product {
            imageUrl
            name
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
      notes
      payment {
        amount
        method
      }
      status
      total
      updatedAt
    }
  }
 `;

export const ALL_ORDERS_QUERY = gql`
  query AllOrders {
    allOrders {
      id
      status
      deliveryAddress
      notes
      assignedRiderId
      createdAt
      updatedAt
      cart {
        id
        userId
        total
        createdAt
        updatedAt
        items {
          quantity
          product {
            id
            name
            description
            quantity
            price
            imageUrl
            merchantId
            currencyId
            categoryId
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export const RIDER_ORDERS_QUERY = gql`
  query RiderOrders {
    riderOrders {
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
    }
  }
`;