"use client";
import React, { useState, useEffect } from "react";
import {
  IconButton,
  Typography,
  Skeleton,
} from "@mui/material";
import { Stack } from "@mui/system";
import {
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

interface QuantityAdjusterProps {
  initialQuantity?: number;
  onQuantityChange: (newQuantity: number) => void;
  loading?: boolean;
}

export const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({ initialQuantity = 1, onQuantityChange, loading = false }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

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
      <IconButton size="small" sx={{
        border: '2px solid',
        mr: 3,
        borderColor: 'primary.main',
        color: 'primary.main',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'primary.main',
          color: '#000',
        },
      }} onClick={handleDecrease} disabled={quantity === 1 || loading}>
        <IconMinus size="18" />
      </IconButton>
      <Typography variant="h6">{loading ? <Skeleton variant="text" width={20} /> : quantity}</Typography>
      <IconButton size="small" sx={{
        border: '2px solid',
        borderColor: 'primary.main',
        color: 'primary.main',
        transition: 'all 0.2s ease',
        ml: 3,
        '&:hover': {
          bgcolor: 'primary.main',
          color: '#000',
        },
      }} onClick={handleIncrease} disabled={loading}>
        <IconPlus size="18" />
      </IconButton>
    </Stack>
  );
};