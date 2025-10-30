'use client';

import React from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

interface ConfettiWrapperProps {
  active: boolean;
}

const ConfettiWrapper: React.FC<ConfettiWrapperProps> = ({ active }) => {
  const { width, height } = useWindowSize();

  if (!active) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      gravity={0.3}
    />
  );
};

export default ConfettiWrapper;