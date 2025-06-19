'use client';
import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

type OrderStatus = 'Order Placed' | 'On the way' | 'Delivered';

interface OrderStatusStepperProps {
  status: OrderStatus;
}

const steps = ['Order Placed', 'On the Way', 'Delivered'];

const getActiveStep = (status: OrderStatus): number => {
  switch (status) {
    case 'Order Placed':
      return 0;
    case 'On the way':
      return 1;
    case 'Delivered':
      return 2;
    default:
      return 0;
  }
};

const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ status }) => {
  const activeStep = getActiveStep(status);

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
