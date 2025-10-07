'use client';
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Paper,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import {
    UPDATE_MERCHANT_DETAILS,
} from '@/graphql';
import FileUploadInput from '@/components/FileUploadInput';
import useAppStore from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const steps = [
    'Business & Bank Details',
    'Legal Documents',
    'Health & Safety Documents',
    'Tax Information',
    'Menu',
    'Bank Confirmation',
];

export default function MerchantVerificationForm() {
    const { userDetails } = useAppStore();
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState({
        bankAccountNumber: '',
        bankName: '',
        businessName: '',
        mpesaPaybill: '',
        mpesaTill: '',
    });

    const [fileUrls, setFileUrls] = useState<Record<string, string>>({
        bankConfirmation: '',
        certificateOfIncorp: '',
        cr12Form: '',
        foodHandlerCert: '',
        healthCert: '',
        kraPinCert: '',
        menuFile: '',
        menuImages: '',
        tradingLicense: '',
        ownerKraPinCert: '',
    });

    const [updateMerchantDetails, { loading, error }] = useMutation(UPDATE_MERCHANT_DETAILS);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUploadSuccess = (name: string) => (url: string) => {
        setFileUrls({ ...fileUrls, [name]: url });
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setForm({
            bankAccountNumber: '',
            bankName: '',
            businessName: '',
            mpesaPaybill: '',
            mpesaTill: '',
        });
        setFileUrls({
            bankConfirmation: '',
            certificateOfIncorp: '',
            cr12Form: '',
            foodHandlerCert: '',
            healthCert: '',
            kraPinCert: '',
            menuFile: '',
            menuImages: '',
            tradingLicense: '',
            ownerKraPinCert: '',
        });
    };

    const isStepComplete = (step: number) => {
        switch (step) {
            case 0:
                return form.businessName !== '' && form.bankAccountNumber !== '' && form.bankName !== '';
            case 1:
                return fileUrls.certificateOfIncorp !== '' && fileUrls.cr12Form !== '' && fileUrls.tradingLicense !== '';
            case 2:
                return fileUrls.foodHandlerCert !== '' && fileUrls.healthCert !== '';
            case 3:
                return fileUrls.kraPinCert !== '' && fileUrls.ownerKraPinCert !== '';
            case 4:
                return fileUrls.menuFile !== '' && fileUrls.menuImages !== '';
            case 5:
                return fileUrls.bankConfirmation !== '';
            default:
                return false;
        }
    };

    const handleFormSubmit = async () => {
        if (!userDetails?.me?.id) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const { data } = await updateMerchantDetails({
                variables: {
                    input: {
                        // userId: userDetails?.me?.id,
                        ...form,
                        ...fileUrls,
                    },
                },
            });

            if (data.updateMerchantDetails.id) {
                toast.success("Merchant verification process completed!");
                router.push("/merchant");
            } else {
                toast.error("Merchant verification failed.");
            }
        } catch (err: any) {
            console.error('Verification submission failed', err);
            toast.error(err.message || "An unexpected error occurred during verification.");
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, sm:6}}><TextField label="Business Name" name="businessName" value={form.businessName} onChange={handleInputChange} fullWidth required /></Grid>
                        <Grid size={{xs:12, sm:6}}><TextField label="Bank Account Number" name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleInputChange} fullWidth required /></Grid>
                        <Grid size={{xs:12, sm:6}}><TextField label="Bank Name" name="bankName" value={form.bankName} onChange={handleInputChange} fullWidth required /></Grid>
                        <Grid size={{xs:12, sm:6}}><TextField label="M-Pesa Paybill" name="mpesaPaybill" value={form.mpesaPaybill} onChange={handleInputChange} fullWidth /></Grid>
                        <Grid size={{xs:12, sm:6}}><TextField label="M-Pesa Till" name="mpesaTill" value={form.mpesaTill} onChange={handleInputChange} fullWidth /></Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Certificate of Incorporation" onUploadSuccess={handleUploadSuccess('certificateOfIncorp')} currentFileUrl={fileUrls.certificateOfIncorp} /></Grid>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="CR12 Form" onUploadSuccess={handleUploadSuccess('cr12Form')} currentFileUrl={fileUrls.cr12Form} /></Grid>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Trading License" onUploadSuccess={handleUploadSuccess('tradingLicense')} currentFileUrl={fileUrls.tradingLicense} /></Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Food Handler Certificate" onUploadSuccess={handleUploadSuccess('foodHandlerCert')} currentFileUrl={fileUrls.foodHandlerCert} /></Grid>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Health Certificate" onUploadSuccess={handleUploadSuccess('healthCert')} currentFileUrl={fileUrls.healthCert} /></Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="KRA PIN Certificate" onUploadSuccess={handleUploadSuccess('kraPinCert')} currentFileUrl={fileUrls.kraPinCert} /></Grid>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Owner KRA PIN Certificate" onUploadSuccess={handleUploadSuccess('ownerKraPinCert')} currentFileUrl={fileUrls.ownerKraPinCert} /></Grid>
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Menu File" onUploadSuccess={handleUploadSuccess('menuFile')} currentFileUrl={fileUrls.menuFile} /></Grid>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Menu Image" onUploadSuccess={handleUploadSuccess('menuImages')} currentFileUrl={fileUrls.menuImages} /></Grid>
                    </Grid>
                );
            case 5:
                return (
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, sm:6}}><FileUploadInput label="Bank Confirmation" onUploadSuccess={handleUploadSuccess('bankConfirmation')} currentFileUrl={fileUrls.bankConfirmation} /></Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Paper sx={{ mt: 4, p: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Merchant Verification
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Please fill in the form below to get your account verified.
                </Typography>
            </Box>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                    <Step key={label} completed={activeStep > index || (activeStep === index && isStepComplete(index))}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box>
                {activeStep === steps.length ? (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>All steps completed!</Typography>
                        <Typography variant="body1">Thank you for completing the merchant verification process. Your documents are being reviewed.</Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                ) : (
                    <Box>
                        {getStepContent(activeStep)}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">Back</Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={activeStep === steps.length - 1 ? handleFormSubmit : handleNext} variant="contained" disabled={!isStepComplete(activeStep) || loading}>
                                {loading ? 'Submitting...' : (activeStep === steps.length - 1 ? 'Finish' : 'Next')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
            {error && <Typography color="error">Error: {error.message}</Typography>}
        </Paper>
    );
}

