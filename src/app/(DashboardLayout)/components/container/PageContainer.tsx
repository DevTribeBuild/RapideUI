// import { Helmet } from 'react-helmet';
import { Box } from '@mui/material';
import react from 'react'


type Props = {
  description?: string;
  children: React.ReactNode;
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (

  <div>

    <title>{title}</title>
    <meta name="description" content={description} />
    <Box sx={{width: "100%", height: "100%" }}>
      {children}
    </Box>
  </div>

);

export default PageContainer;
