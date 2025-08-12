
"use client";
import React, { useState } from "react";
import {
  IconButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import {
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

interface QuantityAdjusterProps {
  initialQuantity?: number;
  onQuantityChange: (newQuantity: number) => void;
}

export const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({ initialQuantity = 1, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(newQty);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton size="small" onClick={handleDecrease} disabled={quantity === 1}>
        <IconMinus size="18" />
      </IconButton>
      <Typography variant="h6">{quantity}</Typography>
      <IconButton size="small" onClick={handleIncrease}>
        <IconPlus size="18" />
      </IconButton>
    </Stack>
  );
};
