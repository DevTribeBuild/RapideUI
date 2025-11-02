import React, { useState, useEffect } from "react";
import { getMenuItems } from "./MenuItems";
import useAppStore from "@/stores/useAuthStore"

import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
  Sidebar as MUI_Sidebar,
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
    console.log("Rendering item:", item.title, "with href:", item.href);

    const Icon = item.icon ? item.icon : IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" style={{ color: currentTheme === 'dark' ? '#FFD700' : '#000000' }} />;

    // const textColor = currentTheme === 'dark' ? '#FFD700' : '#000000';
    const textColor = '#ffd700';
    const selectedColor = theme.palette.primary.main;

    if (item.subheader) {
      // Display Subheader
      return (
        <Box key={item.subheader} sx={{ border: "1p solid red" }}>
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
              mt: 4,
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
        <Box key={item.id}>
          <Submenu
            key={item.id}
            title={item.title}
            icon={React.cloneElement(itemIcon, {
              sx: {
                color: pathDirect === item?.href ? "#000" : textColor,
                fontSize: 22,
              },
            })}
            borderRadius="7px"
            sx={{
              px: 2.5,
              py: 1.2,
              borderRadius: "7px",
              backgroundColor: pathDirect === item?.href ? "#FFD700" : "transparent",
              color: pathDirect === item?.href ? "#000" : textColor,
              transition: "all 0.25s ease-in-out",
              "&:hover": {
                backgroundColor: pathDirect === item?.href ? "#FFD700" : "rgba(0, 0, 0, 0.05)",
                color: "#000",
                "& svg": {
                  color: "#000",
                },
              },
              "& .MuiTypography-root": {
                fontWeight: 600,
                color: pathDirect === item?.href ? "#000" : textColor,
              },
            }}
          >
            {renderMenuItems(item.children, pathDirect, theme, currentTheme)}
          </Submenu>
        </Box>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <Box sx={{ borderBottom: '1px solid #383938' }} key={item.id}>
        <MenuItem
          key={item.id}
          selected={pathDirect === item?.href}
          component={Link}
          link={item.href}
          icon={itemIcon}
          disableRipple
          sx={{
            p: 0, // Remove default padding to delegate it to Box
            borderRadius: "8px",
            overflow: "hidden",
            "&.Mui-selected": {
              backgroundColor: "transparent", // disable default MUI selection color
            },
            "&.Mui-selected:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
              px: 3,
              py: 1.2,
              borderRadius: "8px",
              color: pathDirect === item?.href ? "#000" : textColor,
              backgroundColor: pathDirect === item?.href ? "#FFD700" : "transparent",
              transition: "all 0.25s ease-in-out",
              "&:hover": {
                backgroundColor:
                  pathDirect === item?.href
                    ? "#FFD700"
                    : "rgba(0, 0, 0, 0.05)",
                color: "#000",
                "& svg": { color: "#000" },
              },
            }}
          >
            {/* {React.cloneElement(itemIcon, {
              sx: {
                color: pathDirect === item?.href ? "#000" : textColor,
                fontSize: 24,
              },
            })} */}

            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: pathDirect === item?.href ? "#000" : textColor,
              }}
            >
              {item.title}
            </Typography>
          </Box>
        </MenuItem>
      </Box>
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
    try {
      const items = getMenuItems(user);
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items", error);
    }
  }, [user]);

  return (
    < >
      <MUI_Sidebar width={"100%"} showProfile={false} >

        <Box sx={{ p: 2.5, display: "flex", justifyContent: "center", alignItems: "center" }}>
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


