import useAuthStore, { UserDetails } from "@/stores/useAuthStore";
import client from "@/apolloClient";
import { GET_ME } from "../graphql";

export const handleLoginHelper = async (token: string) => {
  const { setToken, setUserDetails } = useAuthStore.getState();

  // Store token in Zustand store
  setToken(token);

  try {
    const { data } = await client.query<{ me: UserDetails['me'] }>({
      query: GET_ME,
      fetchPolicy: "no-cache",
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (data && data.me) {
      setUserDetails({ me: data.me });
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
};
