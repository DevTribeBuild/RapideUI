'use client';
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { styled } from "@mui/system";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import useAuthStore from "@/stores/useAuthStore";

// ================== STYLES ==================
const HeroSection = styled('section')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: "#fff",
  padding: theme.spacing(20, 2, 16),
  textAlign: 'center',
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: "relative",
  overflow: "hidden",
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  textAlign: 'center',
  height: '100%',
  borderRadius: "20px",
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.8)",
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
}));

const HowItWorksStep = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  textAlign: 'center',
  background: "#fff",
}));

const CTASection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
  color: "#fff",
  padding: theme.spacing(14, 2),
  textAlign: 'center',
  borderRadius: "24px",
  margin: theme.spacing(10, 2),
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(6, 2),
  textAlign: 'center',
}));

// ================== COMPONENT ==================
const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <>
      {/* AppBar */}
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Toolbar sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Swifteroute
          </Typography>
          {user ? (
            <Link href="/explore" passHref>
              <Button color="inherit">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/authentication/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/authentication/register" passHref>
                <Button variant="contained" sx={{ ml: 2, borderRadius: "50px" }}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="900" gutterBottom sx={{ mb: 3 }}>
            Fast. Reliable. Effortless Deliveries.
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 5, maxWidth: "700px", mx: "auto" }}>
            Swifteroute connects you with a trusted rider network for seamless, secure, and lightning-fast deliveries.
          </Typography>
          <Link href="/authentication/register" passHref>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ px: 5, py: 2, fontSize: "1.2rem", borderRadius: "50px" }}
            >
              Get Started
            </Button>
          </Link>
        </Container>
      </HeroSection>

      {/* Features */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Why Choose Swifteroute?
        </Typography>
        <Grid container spacing={6} sx={{ mt: 4 }}>
          {[
            { icon: <LocalShippingIcon fontSize="large" color="primary" />, title: "Real-Time Tracking", text: "Know exactly where your package is at every moment." },
            { icon: <SecurityIcon fontSize="large" color="primary" />, title: "Verified Riders", text: "Every rider is vetted for professionalism and safety." },
            { icon: <MonetizationOnIcon fontSize="large" color="primary" />, title: "Transparent Pricing", text: "No hidden fees. What you see is what you pay." },
            { icon: <PaymentIcon fontSize="large" color="primary" />, title: "Secure Payments", text: "From M-Pesa to cards, pay confidently and securely." },
            { icon: <NotificationsActiveIcon fontSize="large" color="primary" />, title: "Instant Notifications", text: "Get notified at every stage of your delivery." },
            { icon: <VerifiedUserIcon fontSize="large" color="primary" />, title: "Trusted & Insured", text: "Every delivery is backed by our trust guarantee." },
          ].map((feature, i) => (
            <Grid size={{xs:12, md:6}} key={i}>
              <FeaturePaper>
                {feature.icon}
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">{feature.text}</Typography>
              </FeaturePaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: "grey.100", py: 12 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={6} sx={{ mt: 4 }}>
            {[
              { icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />, step: "Place Your Order", text: "Add pickup & drop-off details in seconds." },
              { icon: <DirectionsBikeIcon fontSize="large" color="primary" />, step: "Rider Assigned", text: "A nearby verified rider is instantly assigned." },
              { icon: <DoneAllIcon fontSize="large" color="primary" />, step: "Delivered Safely", text: "Track in real-time until your package arrives." },
            ].map((step, i) => (
              <Grid size={{xs:12, sm:4}} key={i}>
                <HowItWorksStep>
                  {step.icon}
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                    {step.step}
                  </Typography>
                  <Typography color="text.secondary">{step.text}</Typography>
                </HowItWorksStep>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          What Our Customers Say
        </Typography>
        <Grid container spacing={6} sx={{ mt: 4 }}>
          {[
            { name: "Jane W.", text: "Swifteroute saved my business countless hours. Always on time!" },
            { name: "Michael K.", text: "Weekly document deliveries are stress-free with live tracking." },
            { name: "Sarah M.", text: "Professional, polite riders. I feel completely at ease using this." },
          ].map((testimonial, i) => (
            <Grid size={{xs:12, md:4}}key={i}>
              <TestimonialCard>
                <ThumbUpAltIcon color="primary" sx={{ mb: 2 }} />
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  “{testimonial.text}”
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {testimonial.name}
                </Typography>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container>
        <CTASection>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Sign up today and experience the future of deliveries.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            {user ? (
              <Link href="/explore/" passHref>
                <Button variant="contained" size="large" sx={{ borderRadius: "50px", px: 4 }}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/authentication/register" passHref>
                  <Button variant="contained" size="large" sx={{ borderRadius: "50px", px: 4 }}>
                    Register Now
                  </Button>
                </Link>
                <Link href="/authentication/login" passHref>
                  <Button variant="outlined" size="large" sx={{ borderRadius: "50px", px: 4, color: "#fff", borderColor: "#fff" }}>
                    Login
                  </Button>
                </Link>
              </>
            )}
          </Stack>
        </CTASection>
      </Container>

      {/* Footer */}
      <Footer>
        <Container>
          <Typography variant="body2">© {new Date().getFullYear()} Swifteroute. All rights reserved.</Typography>
          <Divider sx={{ my: 2, bgcolor: "grey.700" }} />
          <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap">
            <Link href="/about" passHref><Typography variant="body2" sx={{ cursor: "pointer" }}>About Us</Typography></Link>
            <Link href="/contact" passHref><Typography variant="body2" sx={{ cursor: "pointer" }}>Contact</Typography></Link>
            <Link href="/terms" passHref><Typography variant="body2" sx={{ cursor: "pointer" }}>Terms of Service</Typography></Link>
          </Stack>
        </Container>
      </Footer>
    </>
  );
};

export default LandingPage;
