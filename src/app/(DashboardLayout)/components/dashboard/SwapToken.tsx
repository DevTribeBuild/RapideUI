import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  SelectChangeEvent, // Import for Select onChange event
} from '@mui/material';
import { styled } from '@mui/system';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

/**
 * Interface for a token asset.
 */
interface Asset {
  currency: string;
  type: string;
  icon: string;
}

/**
 * Interface for the details of a completed swap.
 */
interface SwapDetails {
  inputToken: Asset | null;
  outputToken: Asset | null;
  inputAmount: string;
  outputAmount: string;
}

/**
 * Props for the SwapConfirmationMessage component.
 */
interface SwapConfirmationMessageProps {
  open: boolean;
  onClose: () => void;
  swapDetails: SwapDetails | null;
}

/**
 * Props for the SwapTokenDialog component.
 */
interface SwapTokenDialogProps {
  open: boolean;
  onClose: () => void;
  assetOptions: Asset[];
  onSwap: (inputToken: Asset | null, outputToken: Asset | null, inputAmount: string, outputAmount: string) => void;
}

// -----------------------------------------------------------------------------
// Styled Components
// -----------------------------------------------------------------------------

const YellowButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffd700', // Tailwind yellow-500
  color: '#000',
  '&:hover': {
    backgroundColor: '#ffd700', // Tailwind yellow-600
  },
  '&.Mui-disabled': {
    backgroundColor: '#FCD34D', // Lighter yellow for disabled
    color: '#9CA3AF', // Gray text for disabled
  },
}));

const OrangeButton = styled(Button)(({ theme }) => ({
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

// -----------------------------------------------------------------------------
// SwapConfirmationMessage Component
// -----------------------------------------------------------------------------

const SwapConfirmationMessage: React.FC<SwapConfirmationMessageProps> = ({ open, onClose, swapDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
          Swap Confirmed!
        </Typography>
        <Button onClick={onClose} sx={{ minWidth: 0, padding: '4px' }}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 2, color: '#fff' }}>
          Your swap has been initiated successfully.
        </Typography>
        {swapDetails && (
          <Box sx={{ fontSize: '0.875rem', color: '#fff' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>From:</Typography>{' '}
              {swapDetails.inputAmount} {swapDetails.inputToken?.currency}
            </Typography>
            <Typography variant="body2">
              <Typography component="span" sx={{ fontWeight: 'medium' }}>To:</Typography>{' '}
              {swapDetails.outputAmount} {swapDetails.outputToken?.currency}
            </Typography>
          </Box>
        )}
        <Typography variant="body2" sx={{ mt: 4, color: '#ffd700' }}>
          Please check your wallet for transaction status.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <YellowButton onClick={onClose} variant="contained">
          Close
        </YellowButton>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------------------------------------------------------------
// SwapTokenDialog Component
// -----------------------------------------------------------------------------

const SwapTokenDialog: React.FC<SwapTokenDialogProps> = ({ open, onClose, assetOptions = [], onSwap }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [inputToken, setInputToken] = useState<Asset | null>(assetOptions[0] || null);
  const [outputToken, setOutputToken] = useState<Asset | null>(assetOptions[1] || null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [estimatedOutputAmount, setEstimatedOutputAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Effect to reset dialog state when it opens or closes
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setInputToken(assetOptions[0] || null);
      setOutputToken(assetOptions[1] || null);
      setInputAmount('');
      setEstimatedOutputAmount('');
      setIsSwapping(false);
    }
  }, [open, assetOptions]);

  // Effect to simulate output amount calculation based on input
  useEffect(() => {
    if (inputAmount && inputToken && outputToken) {
      const parsedInputAmount = parseFloat(inputAmount);
      if (!isNaN(parsedInputAmount)) {
        // Simple dummy conversion rate for demonstration purposes
        const rate = inputToken.currency === 'ETH' && outputToken.currency === 'USDT' ? 2000 : 0.5;
        const estimated = parsedInputAmount * rate;
        setEstimatedOutputAmount(estimated.toFixed(4));
      } else {
        setEstimatedOutputAmount('');
      }
    } else {
      setEstimatedOutputAmount('');
    }
  }, [inputAmount, inputToken, outputToken]);

  // Handler for moving to the next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handler for moving to the previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handler for confirming the swap (simulates API call)
  const handleConfirmSwap = async () => {
    setIsSwapping(true);
    // Simulate an asynchronous API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSwap(inputToken, outputToken, inputAmount, estimatedOutputAmount);
    setIsSwapping(false);
  };

  // Handler for closing the dialog
  const handleClose = () => {
    onClose();
  };

  // Function to render content based on the current active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="input-token-select-label">Select Token to Swap FROM</InputLabel>
            <Select
              labelId="input-token-select-label"
              id="input-token-select"
              value={inputToken ? inputToken.currency : ''}
              label="Select Token to Swap FROM"
              onChange={(e: SelectChangeEvent<string>) => {
                const selectedCurrency = e.target.value;
                setInputToken(assetOptions.find(a => a.currency === selectedCurrency) || null);
              }}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700', // yellow-500
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffd700', // yellow-600
                },
              }}
            >
              {assetOptions.map((asset) => (
                <MenuItem key={asset.currency} value={asset.currency}>
                  {asset.currency} ({asset.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <Box sx={{ '& > :not(style)': { mb: 2 } }}>
            <FormControl fullWidth>
              <InputLabel id="output-token-select-label">Select Token to Swap TO</InputLabel>
              <Select
                labelId="output-token-select-label"
                id="output-token-select"
                value={outputToken ? outputToken.currency : ''}
                label="Select Token to Swap TO"
                onChange={(e: SelectChangeEvent<string>) => {
                  const selectedCurrency = e.target.value;
                  setOutputToken(assetOptions.find(a => a.currency === selectedCurrency) || null);
                }}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F59E0B', // yellow-500
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D97706', // yellow-600
                  },
                }}
              >
                {assetOptions
                  .filter(asset => asset.currency !== (inputToken ? inputToken.currency : ''))
                  .map((asset) => (
                    <MenuItem key={asset.currency} value={asset.currency}>
                      {asset.currency} ({asset.type})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label={`Amount of ${inputToken?.currency || 'token'}`}
              type="number"
              fullWidth
              value={inputAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputAmount(e.target.value)}
              inputProps={{ min: 0, step: "any" }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#F59E0B', // yellow-500
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D97706', // yellow-600
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F59E0B', // yellow-500
                },
              }}
            />

            {estimatedOutputAmount && (
              <Typography variant="body2" sx={{ mt: 1, color: '#4B5563' }}>
                You will receive approximately:{' '}
                <Typography component="span" sx={{ fontWeight: 'semibold', color: '#EA580C' }}>
                  {estimatedOutputAmount} {outputToken?.currency}
                </Typography>
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: '8px', '& > :not(style)': { mb: 1 } }}>
            <Typography variant="h6" sx={{ fontWeight: 'semibold', color: '#1F2937' }}>
              Confirm Your Swap
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563' }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Swap From:</Typography>{' '}
              {inputAmount} {inputToken?.currency}
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B5563' }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Swap To:</Typography>{' '}
              ~{estimatedOutputAmount} {outputToken?.currency}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mt: 2 }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Note:</Typography>{' '}
              Estimated amount may vary due to market conditions.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
          Swap Tokens
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: 0, padding: '4px' }}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {['Select Input', 'Select Output & Amount', 'Confirm'].map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: activeStep >= index ? '#ffd700' : '#D1D5DB', // yellow-500 / gray-300
                    '&.Mui-active': {
                      color: '#ffd700', // yellow-600 for active
                    },
                    '&.Mui-completed': {
                      color: '#ffd700', // yellow-500 for completed
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    color: activeStep >= index ? '#ffd700' : '#6B7280', // yellow-700 / gray-500
                    fontWeight: activeStep >= index ? 'medium' : 'normal',
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB' }}>
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          disabled={isSwapping}
          variant="contained"
          sx={{
            bgcolor: '#E5E7EB', // gray-200
            color: '#4B5563', // gray-700
            '&:hover': {
              bgcolor: '#D1D5DB', // gray-300
            },
            '&.Mui-disabled': {
              bgcolor: '#F3F4F6', // Lighter gray for disabled
              color: '#9CA3AF', // Gray text for disabled
            },
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: 'none',
          }}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {activeStep < 2 ? (
          <YellowButton
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !inputToken) ||
              (activeStep === 1 && (!inputAmount || parseFloat(inputAmount) <= 0 || !outputToken || inputToken?.currency === outputToken?.currency))
            }
            variant="contained"
          >
            Next
          </YellowButton>
        ) : (
          <OrangeButton
            onClick={handleConfirmSwap}
            disabled={isSwapping}
            variant="contained"
          >
            {isSwapping ? 'Swapping...' : 'Confirm Swap'}
          </OrangeButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

// -----------------------------------------------------------------------------
// Main SwapToken Component
// -----------------------------------------------------------------------------

interface SwapTokenProps {
  assetOptions: Asset[];
}

const SwapToken: React.FC<SwapTokenProps> = ({ assetOptions }) => {
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState<boolean>(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState<boolean>(false);
  const [lastSwapDetails, setLastSwapDetails] = useState<SwapDetails | null>(null);

  // Handler to open the swap dialog
  const handleOpenSwapDialog = () => {
    setIsSwapDialogOpen(true);
  };

  // Handler to close the swap dialog
  const handleCloseSwapDialog = () => {
    setIsSwapDialogOpen(false);
  };

  // Handler for when the swap is confirmed within the dialog
  const handleSwap = (inputToken: Asset | null, outputToken: Asset | null, inputAmount: string, outputAmount: string) => {
    // Store details for the confirmation message
    setLastSwapDetails({ inputToken, outputToken, inputAmount, outputAmount });
    setShowConfirmationMessage(true); // Show the custom confirmation message
    handleCloseSwapDialog(); // Close the swap dialog
  };

  // Handler to close the confirmation message
  const handleCloseConfirmationMessage = () => {
    setShowConfirmationMessage(false);
    setLastSwapDetails(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Box
        sx={{
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  sx={{ mr: 2 }}
>
  <Button
    variant="contained"
    size="small"
    onClick={handleOpenSwapDialog}
    sx={{
      borderRadius: '50%',
      width: 40,
      height: 40,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <SwapHorizIcon />
  </Button>
  <Typography variant="body2" sx={{mt:1}}>
    Swap
  </Typography>
</Box>
      </Box>

      {/* Render the SwapTokenDialog component */}
      <SwapTokenDialog
        open={isSwapDialogOpen}
        onClose={handleCloseSwapDialog}
        assetOptions={assetOptions}
        onSwap={handleSwap}
      />

      {/* Render the SwapConfirmationMessage component */}
      <SwapConfirmationMessage
        open={showConfirmationMessage}
        onClose={handleCloseConfirmationMessage}
        swapDetails={lastSwapDetails}
      />
    </Box>
  );
};

export default SwapToken;