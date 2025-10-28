"use client";
import { styled, Container, Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import BottomAppBar from "@/app/(DashboardLayout)/layout/footer/BottomAppBar";
import useAuthStore from "@/stores/useAuthStore";


const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const theme = useTheme();
  const { user } = useAuthStore();
  console.log("User in Layout:", user);

  return (
    <MainWrapper className="mainwrapper">
      {user?.userType !== 'USER' && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}
      <PageWrapper className="page-wrapper" sx={{ paddingBottom: user?.userType === 'USER' ? '60px' : '0' }}>
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Box
          sx={{
            paddingTop: "20px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
          {children}
          </Box>
        </Box>
        {user?.userType === 'USER' && <BottomAppBar />}
      </PageWrapper>
    </MainWrapper>
  );
}
