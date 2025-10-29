"use client";

import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconBasket,
  IconWallet,
  IconSettings,
  IconUser,
  IconBox,
  IconUsersGroup,
  IconMotorbike,
  IconGift,
  IconCreditCard,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

export const getMenuItems = (user: { userType?: string } | null) => {
  const userType = user?.userType;

  const Menuitems = [
    {
      navlabel: true,
      subheader: "HOME",
    },
    // {
    //   id: uniqueId(),
    //   title: "Home",
    //   icon: IconLayoutDashboard,
    //   href: "/",
    //   userType: ["ADMIN", "RIDER", "MERCHANT"],
    // },
    {
      id: uniqueId(),
      title: "Explore",
      icon: IconLayoutDashboard,
      href: "/explore",
    },
    {
      id: uniqueId(),
      title: "Cart",
      icon: IconBasket,
      href: "/cart",
      userType: ["ADMIN", "USER", "MERCHANT"],
    },
    {
      id: uniqueId(),
      title: "Products",
      icon: IconBox,
      href: "/products",
      userType: ["ADMIN", "MERCHANT"],
    },
    {
      id: uniqueId(),
      title: "Users",
      icon: IconUsersGroup,
      href: "/users",
      userType: ["ADMIN"],
    },
    {
      id: uniqueId(),
      title: "Merchants",
      icon: IconUsersGroup, // Reusing IconUsersGroup
      href: "/admin/merchants",
      userType: ["ADMIN"],
    },
    {
      id: uniqueId(),
      title: "Riders",
      icon: IconMotorbike,
      href: "/riders",
      userType: ["ADMIN"],
    },
    {
      id: uniqueId(),
      title: "My Orders",
      icon: IconGift,
      href: "/cart/orders",
      userType: ["USER", "RIDER", "MERCHANT", "ADMIN"],
    },
    {
      id: uniqueId(),
      title: "Assigned Orders",
      icon: IconGift,
      href: "/riders/assigned-orders",
      userType: ["RIDER"],
    },
    // {
    //   id: uniqueId(),
    //   title: "All Orders",
    //   icon: IconMoodHappy,
    //   href: "/orders",
    //   userType: ["ADMIN"],
    // },
    {
      id: uniqueId(),
      title: "Manage Orders",
      icon: IconGift,
      href: "/admin/orders",
      userType: ["ADMIN"],
    },
    {
      id: uniqueId(),
      title: "Payments",
      icon: IconCreditCard,
      href: "/payments",
      userType: ["ADMIN", "MERCHANT"],
    },
    {
      navlabel: true,
      subheader: "UTILITIES",
      userType: ["ADMIN", "USER", "RIDER", "MERCHANT"],
    },
    {
      id: uniqueId(),
      title: "My Profile",
      icon: IconUser,
      href: "/profile",
      userType: ["ADMIN", "USER", "RIDER", "MERCHANT"],
    },
    {
      id: uniqueId(),
      title: "Wallet",
      icon: IconWallet,
      href: "/wallet",
      userType: ["ADMIN", "USER", "RIDER", "MERCHANT"],
    },
    // {
    //   id: uniqueId(),
    //   title: "Settings",
    //   icon: IconSettings,
    //   href: "/utilities/shadow",
    //   userType: ["ADMIN", "USER", "RIDER", "MERCHANT"],
    // },
    // {
    //   navlabel: true,
    //   subheader: "AUTH",
    // },
    // {
    //   id: uniqueId(),
    //   title: "Login",
    //   icon: IconLogin,
    //   href: "/authentication/login",
    //   userType: ["ADMIN", "USER"],
    // },
    // {
    //   id: uniqueId(),
    //   title: "Register",
    //   icon: IconUserPlus,
    //   href: "/authentication/register",
    //   userType: ["ADMIN", "USER"],
    // },
    // {
    //   navlabel: true,
    //   subheader: "GUIDE",
    // },
    // {
    //   id: uniqueId(),
    //   title: "FAQ",
    //   icon: IconMoodHappy,
    //   href: "/icons",
    // },
    // {
    //   id: uniqueId(),
    //   title: "Help",
    //   icon: IconAperture,
    //   href: "/sample-page",
    // },
  ];

  return Menuitems.filter(
    (item) =>
      !item.userType || (Array.isArray(item.userType) && item.userType.includes(userType!))
  );
};