"use client";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthRegister from "../auth/AuthRegister";

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ width: '100%', maxWidth: '500px' }}
      >
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          size={{
            xs: 12
          }}>
          <Card
            sx={{ p: 4, zIndex: 1, width: "100%" }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Logo />
            </Box>
            <AuthRegister
              subtext={
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mb={1}
                >
                  Create an Account
                </Typography>
              }
              subtitle={
                <>
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                >
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/authentication/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Sign In
                  </Typography>
                  <br/>
                </Stack>
                                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                >

                  <Typography
                    component={Link}
                    href="/authentication/register/professional"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                    >
                    Register as a merchant or rider ?
                  </Typography>
                    </Stack>
                  </>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Register2;
