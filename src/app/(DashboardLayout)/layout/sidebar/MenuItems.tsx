import {
  IconHome,
  IconBuilding
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Inicio",
  },
  {
    id: uniqueId(),
    title: "Establecimientos",
    icon: IconBuilding,
    href: "/establecimientos",
  },
  {
    id: uniqueId(),
    title: "Servicios basicos",
    icon: IconBuilding,
    href: "/servicios-basicos",
  },
  {
    id: uniqueId(),
    title: "Servicios seguridad",
    icon: IconBuilding,
    href: "/servicios-seguridad",
  },
];

export default Menuitems;
