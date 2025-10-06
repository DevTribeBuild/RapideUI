import React, {useState,  useEffect} from "react";
import { getMenuItems } from "./MenuItems";
import useAppStore from "@/stores/useAuthStore"

import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upgrade } from "./Updrade";
import Image from "next/image";

import { IconProps } from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import useThemeStore from "@/stores/useThemeStore";

type MenuItemType =
    {
      id?: string;
      navlabel?: boolean;
      subheader?: string;
      title?: string;
      icon?: ForwardRefExoticComponent<IconProps & RefAttributes<any>>;
      href?: string;
      userType?: string[];
    };



const renderMenuItems = (items: any, pathDirect: any, theme: any) => {

  return items.map((item: any) => {

    const Icon = item.icon ? item.icon : IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      // Display Subheader
      return (
        <Menu
          subHeading={item.subheader}
          key={item.subheader}
          sx={{color: pathDirect === item?.href ? theme.palette.primary.main : theme.palette.text.secondary}}
        />
      );
    }

    //If the item has children (submenu)
    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='7px'
          sx={{color: pathDirect === item?.href ? theme.palette.primary.main : theme.palette.text.secondary}}
        >
          {renderMenuItems(item.children, pathDirect, theme)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <MenuItem
        key={item.id}
        isSelected={pathDirect === item?.href}
        borderRadius='8px'
        icon={itemIcon}
        link={item.href}
        component={Link}
        sx={{ 
          px: 3,
          // color: pathDirect === item?.href ? theme.palette.primary.main : theme.palette.text.secondary,
          border:"1px solid red",
          color:"red !important"
        }} // Add padding directly to MenuItem
      >
        <Typography variant="body1" sx={{color: pathDirect === item?.href ? theme.palette.primary.main : theme.palette.text.secondary}} fontWeight={500}>
        {item.title} 
        </Typography>
      </MenuItem >
    );
  });
};


const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const user = useAppStore((state) => state.user);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const theme = useTheme();
  const { theme: currentTheme } = useThemeStore();

  useEffect(() => {
    try{
      console.log("user", user?.userType || "");
      const items = getMenuItems(user);
      setMenuItems(items);
    } catch(error) {
      console.error("Error fetching menu items", error);
    }
  }, [user]);

  return (
    < >
      <MUI_Sidebar width={"100%"} showProfile={false} themeColor={theme.palette.primary.main} themeSecondaryColor={theme.palette.secondary.main} >

        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image
            src={currentTheme === 'dark' ? "/images/logos/image.png" : "/images/logos/image.png"}
            alt="logo"
            style={{ objectFit: 'contain' }}
            width={200}
            height={70}
          />
        </Box>
        <Divider />
        {renderMenuItems(menuItems, pathDirect, theme)}
        <Box px={2}>
          <Upgrade />
        </Box>
      </MUI_Sidebar>

    </>
  );
};
export default SidebarItems;

