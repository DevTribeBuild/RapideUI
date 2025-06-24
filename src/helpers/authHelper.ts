import useAuthStore from "@/stores/useAuthStore";
import client from "@/apolloClient";
import { GET_ME } from "../graphql/queries";

export const handleLoginHelper = async (token: string) => {
  const { setToken, setUserDetails } = useAuthStore.getState();

  // Store token in Zustand store
  setToken(token);

  try {
    const { data } = await client.query({
      query: GET_ME,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    setUserDetails(data.me);
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
};
