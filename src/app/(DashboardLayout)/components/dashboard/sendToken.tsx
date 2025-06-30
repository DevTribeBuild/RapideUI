"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import { GET_ALL_USERS } from "@/graphql/queries";
import { SEND_TOKEN } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import toast from 'react-hot-toast';
import useAuthStore from "@/stores/useAuthStore";

const SendTokenDialog = ({
  open,
  onClose,
  assetOptions = [],
  onSend,
}) => {
  const [sendTokenMutation, { loading:loading_send_token, error:error_sending_token, data:data_sending_token }] = useMutation(SEND_TOKEN);
const token = useAuthStore((state:any) => state.token);
  
  const [activeStep, setActiveStep] = useState<any>(0);
  const [selectedUser, setSelectedUser] = useState<any>("");
  const [sendAmount, setSendAmount] = useState<any>("");
  const [sendAsset, setSendAsset] = useState<any>(assetOptions[0] || {});
  const { data:data_users, loading:loading_users, error:error_users, refetch:refetch_users } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "cache-and-network",
  });
    const handleSendToken = () => {
      const payload = {
        input: {
          amount: sendAmount,
          isTest: false, // or true if it's for testing
          to: selectedUser.walletAddress,
          token: "0x55d398326f99059ff775485246999027b3197955",
        },
      };
      sendTokenMutation({ variables: payload,  context: { headers: { Authorization: `Bearer ${token}` } } })
      .then((res) => {
        if(res.data.sendToken.status == "failed") {
          toast.error(res.data.sendToken.message || "Failed to send token");
          return;
        }
        console.log("Send token response:", res.data);
        toast.success(res.data.sendToken.message || "Token sent successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send token");
      })
      .finally(() => {
        handleClose();
      });
    };
    console.log("Users Data:", data_users);
    const users = data_users?.users || [];
    const reset = () => {
      setActiveStep(0);
      setSelectedUser("");
      setSendAmount("");
      setSendAsset(assetOptions[0] || {});
    };

  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Send Tokens</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Select User</StepLabel>
          </Step>
          <Step>
            <StepLabel>Enter Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirm</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <FormControl fullWidth>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              label="Select User"
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users?.map((u:any) => (
                <MenuItem key={u.id} value={u}>
                  {u.email || u.name || "Unknown User"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {activeStep === 1 && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Asset</InputLabel>
              <Select
                value={
                  sendAsset?.type && sendAsset?.currency
                    ? `${sendAsset.type}:${sendAsset.currency}`
                    : ""
                }
                label="Asset"
                onChange={(e) => {
                  const [type, currency] = e.target.value.split(":");
                  setSendAsset({ type, currency });
                }}
              >
                {assetOptions.map((a:any) => (
                  <MenuItem key={a.currency} value={`${a.type}:${a.currency}`}>
                    {a.currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              inputProps={{ min: 0, step: "any" }}
            />
          </>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography sx={{ mb: 1 }}>
              <strong>Recipient:</strong>{" "}
              {users.find((u:any) => u == selectedUser)?.email || "-"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Amount:</strong> {sendAmount}
            </Typography>
            <Typography>
              <strong>Asset:</strong> {sendAsset?.currency || "-"}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            activeStep === 0 ? handleClose() : setActiveStep(activeStep - 1)
          }
          disabled={loading_send_token}
        >
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>
        {activeStep < 2 ? (
          <Button
            variant="contained"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={
              (activeStep === 0 && !selectedUser) ||
              (activeStep === 1 &&
                (!sendAmount || Number(sendAmount) <= 0 || !sendAsset?.currency))
            }
          >
            Next
          </Button>
        ) : (
          <>
          <Button variant="contained" onClick={handleSendToken}  disabled={loading_send_token}>
            {loading_send_token ? "Sending..." : "Send"}
          </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SendTokenDialog;
