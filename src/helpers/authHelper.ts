import useAuthStore, { User, UserDetails } from "@/stores/useAuthStore";
import client from "@/apolloClient";
import { GET_MY_RIDER_DETAILS_QUERY } from "@/graphql/queries";
import {  MY_MERCHANT_DETAILS } from "@/graphql";
import { GET_ME } from "@/graphql";
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

  if (user.userType === "RIDER") {
    try {
      const { data: riderData } = await client.query({
        query: GET_MY_RIDER_DETAILS_QUERY,
        variables: { userId: user.id },
        fetchPolicy: "no-cache",
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (riderData && riderData.riderDetails && riderData.riderDetails.status === "APPROVED") {
        router.push("/explore");
      } else {
        router.push("/riders/verify");
      }
    } catch (error) {
      console.error("Failed to fetch rider details:", error);
      router.push("/riders/verify"); // Redirect to form if fetching fails
    }
  } else if (user.userType === "MERCHANT") {
    try {
      const { data: merchantData } = await client.query({
        query: MY_MERCHANT_DETAILS,
        fetchPolicy: "no-cache",
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (merchantData && merchantData.myMerchantDetails && merchantData.myMerchantDetails.status === "APPROVED") {
        router.push("/products");
      } else {
        router.push("/merchant/verify");
      }
    } catch (error) {
      console.error("Failed to fetch merchant details:", error);
      router.push("/merchant/verify"); // Redirect to form if fetching fails
    }
  } else if (user.userType === "ADMIN") {
    router.push("/explore");
  } else {
    router.push("/explore");
  }
};
