import React, { useState } from "react";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation } from "@apollo/client/react";
import { SINGLE_UPLOAD_MUTATION } from "@/graphql/upload/mutations";
import toast from "react-hot-toast";

interface FileUploadInputProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  currentFileUrl?: string | null;
}

type SingleUploadMutationResult = {
  singleUpload: {
    success: boolean;
    message: string;
    url: string;
  };
};

type SingleUploadMutationVariables = {
  file: File;
};

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  onUploadSuccess,
  currentFileUrl,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFile, { loading, error }] = useMutation<SingleUploadMutationResult, SingleUploadMutationVariables>(
    SINGLE_UPLOAD_MUTATION
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Automatically trigger upload when a file is selected
      try {
        const { data } = await uploadFile({ variables: { file: file } });
        if (data && data.singleUpload && data.singleUpload.success) {
          onUploadSuccess(data.singleUpload.url);
          toast.success(`${label} uploaded successfully!`);
          setSelectedFile(null); // Clear selected file after successful upload
        } else {
          toast.error(data?.singleUpload?.message || `Failed to upload ${label}.`);
        }
      } catch (err) {
        console.error(`Error uploading ${label}:`, err);
        toast.error(`Error uploading ${label}. Please try again.`);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    try {
      const { data } = await uploadFile({ variables: { file: selectedFile } });
      if (data && data.singleUpload && data.singleUpload.success) {
        onUploadSuccess(data.singleUpload.url);
        toast.success(`${label} uploaded successfully!`);
        setSelectedFile(null); // Clear selected file after successful upload
      } else {
        toast.error(data?.singleUpload?.message || `Failed to upload ${label}.`);
      }
    } catch (err) {
      console.error(`Error uploading ${label}:`, err);
      toast.error(`Error uploading ${label}. Please try again.`);
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <input
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        id={`file-upload-${label.replace(/\s/g, "-")}`}
        onChange={handleFileChange}
      />
      <label htmlFor={`file-upload-${label.replace(/\s/g, "-")}`}>
        <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : selectedFile ? selectedFile.name : `Choose ${label}`}
        </Button>
      </label>
      
      {currentFileUrl && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Current file: <a href={currentFileUrl} target="_blank" rel="noopener noreferrer">View</a>
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Error: {error.message}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadInput;
