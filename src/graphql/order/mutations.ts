import { gql } from "@apollo/client";

export const ASSIGN_NEAREST_RIDER_MUTATION = gql`
  mutation AssignNearestRider($orderId: String!) {
  assignNearestRider(orderId: $orderId) {
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
          currency {
            code
            createdAt
            decimals
            id
            name
            rateToUSD
            symbol
            updatedAt
          }
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

export const PAY_ORDER_MUTATION = gql`
  mutation PayOrder($orderId: String!, $tokenSymbol: String!) {
  payOrder(orderId: $orderId, tokenSymbol: $tokenSymbol) {
    message
    order {
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
            currency {
              code
              createdAt
              decimals
              id
              name
              rateToUSD
              symbol
              updatedAt
            }
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
    transactionHash
  }
}
`;

export const UPDATE_ORDER_STATUS_MUTATION = gql`
   mutation UpdateOrderStatus($orderId: String!, $status: String!) {
     updateOrderStatus(orderId: $orderId, status: $status) {
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

export const CREATE_ORDER_MUTATION = gql`
   mutation CreateOrder($input: CreateOrderInput!) {
     createOrder(input: $input) {
       id
       status
       deliveryAddress
       notes
       assignedRiderId
       createdAt
       updatedAt
       cart {
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
