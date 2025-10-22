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



const renderMenuItems = (items: any, pathDirect: any, theme: any, currentTheme: 'light' | 'dark') => {

  return items.map((item: any) => {

    const Icon = item.icon ? item.icon : IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" style={{color:currentTheme === 'dark' ? '#FFD700' : '#000000'}}/>;

    // const textColor = currentTheme === 'dark' ? '#FFD700' : '#000000';
    const textColor = '#ffd700';
    const selectedColor = theme.palette.primary.main;

    if (item.subheader) {
      // Display Subheader
      return (
        <Box key={item.subheader}>
          {/* <Menu
            subHeading={item.subheader}
            key={item.subheader}
            style={{
              color: currentTheme === 'dark' ? '#FFD700' : '#000000'
            }}
          /> */}
          <Typography
            variant="subtitle2"
            sx={{
              pl: 3,
              pt: 2,
              pb: 1,
              fontWeight: 'bold',
              color: currentTheme === 'dark' ? '#fff' : '#000000'
            }}
          >
            {item.subheader}
          </Typography>
        </Box>
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
        >
          {renderMenuItems(item.children, pathDirect, theme, currentTheme)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <MenuItem
        key={item.id}
        isSelected={pathDirect === item?.href}
        borderRadius='8px'
        icon={
          React.cloneElement(itemIcon, {
            sx: {
              color: pathDirect === item?.href ? selectedColor : textColor,
              fontSize: 24, // optional
            },
          })
        }
        link={item.href}
        component={Link}
        sx={{ 
          px: 3,
          color: pathDirect === item?.href ? selectedColor : textColor,
          backgroundColor: pathDirect === item?.href ? (currentTheme === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent',
        }} // Add padding directly to MenuItem
      >
        <Typography

          variant="body1"
          sx={{
            fontWeight: 500,
            color: pathDirect === item?.href ? selectedColor : textColor,
          }}
        >
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
      <MUI_Sidebar width={"100%"} showProfile={false} >

        <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="bold" color={theme.palette.primary.main}>
            Swifteroute
          </Typography>
        </Box>
        <Divider />
        {renderMenuItems(menuItems, pathDirect, theme, currentTheme)}
        <Box px={2}>
          <Upgrade />
        </Box>
      </MUI_Sidebar>

    </>
  );
};
export default SidebarItems;


