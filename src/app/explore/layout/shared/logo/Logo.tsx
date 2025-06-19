import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  // height: "70px",
  // width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image
        src="/images/logos/image.png"
        alt="logo"
        style={{ objectFit: 'contain' }}
        width={200}
        height={70}
      />
      {/* <Image src="/images/logos/image.png" alt="logo" style={{ objectFit: 'cover' }}   priority /> */}
    </LinkStyled>
  );
};

export default Logo;
  