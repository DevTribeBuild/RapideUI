import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import useAppStore from '@/stores/useAuthStore';

const Upgrade  = () => {
    const user = useAppStore((state) => state.user);

    if (user) return null; // Don't render if user exists

    return (
        <Box
            display='flex'
            alignItems="center"
            gap={2}
            sx={{ mt: 3, p: 3, bgcolor: 'primary.light', borderRadius: '8px' }}
        >
            <Box>
                <Typography variant="h5" sx={{ width: "80px" }} fontSize='16px' mb={1}>
                    Don&apos;t have an account?
                </Typography>
                <Button
                    color="primary"
                    target="_blank"
                    disableElevation
                    component={Link}
                    href="/authentication/register"
                    variant="contained"
                    aria-label="logout"
                    size="small"
                >
                    Sign Up
                </Button>
            </Box>
            <Box mt="-35px">
                <Image
                    alt="Rocket"
                    src='/images/backgrounds/rocket.png'
                    width={100}
                    height={100}
                />
            </Box>
        </Box>
    );
};
export default Upgrade;