'use client';
import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'assigned'
  | 'delivered'
  | 'cancelled'
  | 'confirmed'
  | 'in_transit'
  | 'rejected'
  | 'awaiting_payment_confirmation';

interface OrderStatusStepperProps {
  status: OrderStatus;
}

const steps = ['Order Placed', 'On the Way', 'Delivered'];

const getActiveStep = (status: OrderStatus): number => {
  switch (status) {
    case 'pending':
    case 'paid':
    case 'awaiting_payment_confirmation':
    case 'confirmed':
    case 'processing':
      return 0; // Order Placed
    case 'assigned':
    case 'in_transit':
      return 1; // On the Way
    case 'delivered':
      return 2; // Delivered
    case 'cancelled':
    case 'rejected':
      return -1; // Indicates a state not on the stepper
    default:
      return 0;
  }
};

const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ status }) => {
  const activeStep = getActiveStep(status);

  if (activeStep < 0) {
    return null; // Don't render the stepper for cancelled or rejected orders
  }

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default OrderStatusStepper;