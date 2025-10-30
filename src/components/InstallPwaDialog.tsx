'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InstallPwaDialog = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      setDialogOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA installation prompt');
        } else {
          console.log('User dismissed the PWA installation prompt');
        }
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        setDialogOpen(false);
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>

      <Dialog
        open={dialogOpen && showInstallPrompt}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            position: 'fixed',
            bottom: 20,
            right: 20,
            margin: 0,
            maxWidth: 'calc(100% - 40px)',
          },
        }}
      >
        <DialogTitle>
          <Typography sx={{ color: '#ffd700', fontWeight: 'bold' }}>
            Install RapideUI !
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-slide-description">
            We recommend this for a seamless experience.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Dismiss</Button>
          <Button onClick={handleInstallClick} variant="contained" color="primary">
            Install
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstallPwaDialog;