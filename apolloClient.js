import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client"; // Import createUploadLink
import useAuthStore from "@/stores/useAuthStore";

const uploadLink = createUploadLink({
  uri: "https://zyntra-backend-1.onrender.com/graphql/",
});

const authLink = setContext((_, { headers }) => {
  // Access token from Zustand store
  const token = useAuthStore.getState().token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Use uploadLink here
  cache: new InMemoryCache(),
});

export default client;