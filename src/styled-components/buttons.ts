import { styled } from '@mui/system';
import { Button } from '@mui/material';

export const YellowButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F59E0B', // Tailwind yellow-500
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#D97706', // Tailwind yellow-600
  },
  '&.Mui-disabled': {
    backgroundColor: '#FCD34D', // Lighter yellow for disabled
    color: '#9CA3AF', // Gray text for disabled
  },
}));

export const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F97316', // Tailwind orange-500
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#EA580C', // Tailwind orange-600
  },
  '&.Mui-disabled': {
    backgroundColor: '#FDBA74', // Lighter orange for disabled
    color: '#9CA3AF', // Gray text for disabled
  },
}));

export const GreyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E5E7EB', // gray-200
  color: '#4B5563', // gray-700
  '&:hover': {
    backgroundColor: '#D1D5DB', // gray-300
  },
  '&.Mui-disabled': {
    backgroundColor: '#F3F4F6', // Lighter gray for disabled
    color: '#9CA3AF', // Gray text for disabled
  },
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: 'none',
}));
