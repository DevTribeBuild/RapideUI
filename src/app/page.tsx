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

const HeroSection = styled('div')(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(12, 2),
  textAlign: 'center',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: theme.shadows ? theme.shadows[6] : 'none',
  },
}));

const HowItWorksStep = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows ? theme.shadows[3] : 'none',
  textAlign: 'center',
}));

const CTASection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(10, 2),
  textAlign: 'center',
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(6, 2),
  textAlign: 'center',
}));

const LandingPage = () => {
  return (
    <>
      {/* Transparent AppBar */}
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Swifteroute
          </Typography>
          <Link href="/authentication/login" passHref>
            <Button color="inherit">Login</Button>
          </Link>
          <Link href="/authentication/register" passHref>
            <Button variant="outlined" color="inherit" sx={{ ml: 2 }}>
              Register
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Fast, Reliable, and Efficient Deliveries
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ opacity: 0.9 }}>
            Swifteroute connects individuals and businesses with a network of trusted riders for secure, fast, and seamless deliveries.
          </Typography>
          <Link href="/authentication/register" passHref>
            <Button variant="contained" size="large" sx={{ mt: 4, px: 4, py: 1.5 }}>
              Get Started
            </Button>
          </Link>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
          Why Choose Swifteroute?
        </Typography>
        <Grid container spacing={6} sx={{ mt: 4 }}>
          {[
            { icon: <LocalShippingIcon fontSize="large" color="primary" />, title: "Real-Time Tracking", text: "Track your deliveries in real-time from pickup to drop-off." },
            { icon: <SecurityIcon fontSize="large" color="primary" />, title: "Verified Riders", text: "All riders are vetted and verified for safety and reliability." },
            { icon: <MonetizationOnIcon fontSize="large" color="primary" />, title: "Transparent Pricing", text: "Upfront pricing with no hidden fees, always." },
            { icon: <PaymentIcon fontSize="large" color="primary" />, title: "Secure Payments", text: "Pay with cards, M-Pesa, or even cryptocurrency securely." },
            { icon: <NotificationsActiveIcon fontSize="large" color="primary" />, title: "Instant Notifications", text: "Stay updated on every step of your delivery journey." },
            { icon: <VerifiedUserIcon fontSize="large" color="primary" />, title: "Rider Verification", text: "Riders provide IDs, licenses, and insurance for full trust." },
          ].map((feature, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <FeaturePaper elevation={3}>
                {feature.icon}
                <Typography variant="h6" gutterBottom fontWeight="bold">{feature.title}</Typography>
                <Typography color="text.secondary">{feature.text}</Typography>
              </FeaturePaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 10 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
            How It Works
          </Typography>
          <Grid container spacing={6} sx={{ mt: 4 }}>
            {[
              { icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />, step: "1. Place Your Order", text: "Enter pickup & drop-off details in seconds." },
              { icon: <DirectionsBikeIcon fontSize="large" color="primary" />, step: "2. Rider Assigned", text: "A verified rider is assigned instantly." },
              { icon: <DoneAllIcon fontSize="large" color="primary" />, step: "3. Delivered Safely", text: "Track and receive your delivery with ease." },
            ].map((step, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <HowItWorksStep>
                  {step.icon}
                  <Typography variant="h6" gutterBottom fontWeight="bold">{step.step}</Typography>
                  <Typography color="text.secondary">{step.text}</Typography>
                </HowItWorksStep>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
          What Our Customers Say
        </Typography>
        <Grid container spacing={6} sx={{ mt: 4 }}>
          {[
            { name: "Jane W.", text: "Swifteroute saved my business countless hours. Deliveries are always on time!" },
            { name: "Michael K.", text: "I use it weekly for sending documents. The real-time tracking is a game changer." },
            { name: "Sarah M.", text: "The riders are professional and trustworthy. I feel safe using this service." },
          ].map((testimonial, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <TestimonialCard>
                <ThumbUpAltIcon color="primary" sx={{ mb: 2 }} />
                <Typography color="text.secondary" sx={{ mb: 2 }}>"{testimonial.text}"</Typography>
                <Typography variant="subtitle1" fontWeight="bold">{testimonial.name}</Typography>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call To Action Section */}
      <CTASection>
        <Container maxWidth="sm">
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Ready to get started?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Sign up today and experience the future of deliveries.
          </Typography>
          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            <Link href="/authentication/register" passHref>
              <Button variant="contained" size="large">
                Register Now
              </Button>
            </Link>
            <Link href="/authentication/login" passHref>
              <Button variant="outlined" size="large">
                Login
              </Button>
            </Link>
          </Stack>
        </Container>
      </CTASection>

      {/* Footer */}
      <Footer>
        <Container>
          <Typography variant="body1">© {new Date().getFullYear()} Swifteroute. All rights reserved.</Typography>
          <Divider sx={{ my: 2, bgcolor: "grey.700" }} />
          <Stack direction="row" spacing={4} justifyContent="center">
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
