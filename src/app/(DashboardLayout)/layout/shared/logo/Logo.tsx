import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "200px",
  width: "300px",
  overflow: "hidden",
  display: "block",
  transition: "transform 0.3s ease, opacity 0.3s ease", // Transición suave en hover
  
  "&:hover": {
    transform: "scale(1.1)", // Aumenta el tamaño en hover
    opacity: 0.8, // Reduce la opacidad en hover
  },
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
  <Image 
    src="/images/logos/LogoLaCruz1-removebg-preview.png" 
    alt="logo" 
    height={200}
    width={300} 
    priority 
  />
</LinkStyled>

  );
};

export default Logo;
