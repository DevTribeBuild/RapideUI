import { gql } from '@apollo/client';

export const PRODUCT_QUERY = gql`
   query Product($id: String!) {
     product(id: $id) {
       id
       name
       description
       price
       imageUrl
       merchantId
       currencyId
       categoryId
       quantity
       createdAt
       updatedAt
     }
   }
 `;

//  category {
//    createdAt
//    id
//    name
//    parentId
//    updatedAt
//  }
// currency {
//   code
//   createdAt
//   decimals
//   id
//   name
//   rateToUSD
//   symbol
//   updatedAt
// }
// merchant {
//   createdAt
//   currencyId
//   email
//   firstName
//   id
//   imageUrl
//   lastName
//   phone
//   updatedAt
//   userType
//   username
//   walletAddress
//   merchantDetails {
//     businessName
//     id
//   }
// }
export const PRODUCTS_BY_MERCHANT_QUERY = gql`
query ProductsByMerchant($merchantId: String!) {
  productsByMerchant(merchantId: $merchantId) {
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
}
 `;

export const ALL_PRODUCTS_QUERY = gql`
query AllProducts {
  allProducts {
    category {
      createdAt
      id
      name
      parentId
      updatedAt
    }
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
      merchantDetails {
        businessName
        id
      }
    }
    merchantId
    name
    price
    quantity
    updatedAt
  }
}
 `;
