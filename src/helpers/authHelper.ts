import useAuthStore, { User, UserDetails } from "@/stores/useAuthStore";
import client from "@/apolloClient";
import { GET_ME } from "../graphql";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleLoginHelper = async (token: string, user: User, router: AppRouterInstance) => {
  const { setToken, setUserDetails, setUser } = useAuthStore.getState();

  // Store token in Zustand store
  setToken(token);
  setUser(user);

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

  if (user.userType === "ADMIN") {
    router.push("/");
  } else {
    router.push("/explore");
  }
};
