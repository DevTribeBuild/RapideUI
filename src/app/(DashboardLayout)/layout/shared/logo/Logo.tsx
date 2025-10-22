import Link from "next/link";
import { styled, Typography, useTheme } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  // height: "70px",
  // width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  const muiTheme = useTheme();
  return (
    <LinkStyled href="/">
      <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, color: muiTheme.palette.text.primary }}>
        Swifteroute
      </Typography>
    </LinkStyled>
  );
};

export default Logo;
