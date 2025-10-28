import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  IconLayoutDashboard,
  IconBasket,
  IconGift,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";

const BottomAppBar = () => {
  const pathname = usePathname();
  const [value, setValue] = useState(pathname);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const navItems = [
    {
      label: "Explore",
      icon: <IconLayoutDashboard size="24" />,
      href: "/explore",
    },
    {
      label: "Cart",
      icon: <IconBasket size="24" />,
      href: "/cart",
    },
    {
      label: "My Orders",
      icon: <IconGift size="24" />,
      href: "/cart/orders",
    },
    {
      label: "Profile",
      icon: <IconUser size="24" />,
      href: "/profile",
    },
    {
      label: "Wallet",
      icon: <IconWallet size="24" />,
      href: "/wallet",
    },
  ];

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.href}
            label={item.label}
            icon={item.icon}
            component={Link}
            href={item.href}
            value={item.href}
            sx={{
              color: pathname === item.href ? 'primary.main' : 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </AppBar>
  );
};

export default BottomAppBar;
