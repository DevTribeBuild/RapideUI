'use client';
import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'ASSIGNED'
  | 'DELIVERED'
  | 'CENCELLED'
  | 'CONFIRMED'
  | 'IN_TRANSIT'
  | 'REJECTED'
  | 'AWAITING_PAYMENT_CONFIRMATION';

interface OrderStatusStepperProps {
  status: OrderStatus;
}

const steps = ['Order Placed', 'On the Way', 'Delivered'];

const getActiveStep = (status: OrderStatus): number => {
  switch (status) {
    case 'PENDING':
    case 'PAID':
    case 'AWAITING_PAYMENT_CONFIRMATION':
    case 'CONFIRMED':
    case 'PROCESSING':
      return 0; // Order Placed
    case 'ASSIGNED':
    case 'IN_TRANSIT':
      return 1; // On the Way
    case 'DELIVERED':
      return 2; // Delivered
    case 'CENCELLED':
    case 'REJECTED':
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