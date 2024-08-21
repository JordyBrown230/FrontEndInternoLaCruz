import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "90px",
  width: "200px",
  overflow: "hidden",
  display: "block",
  transition: "transform 0.3s ease, opacity 0.3s ease", // Transición suave en hover
  borderRadius: "15px", // Bordes redondeados
  marginTop: "20px", // Espacio adicional arriba para mover el logo hacia abajo
  "&:hover": {
    transform: "scale(1.1)", // Aumenta el tamaño en hover
    opacity: 0.8, // Reduce la opacidad en hover
  },
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/images/logos/123.jpg" alt="logo" height={70} width={174} priority />
    </LinkStyled>
  );
};

export default Logo;
