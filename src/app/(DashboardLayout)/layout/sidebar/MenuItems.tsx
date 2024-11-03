import {
  IconHome,
  IconBuilding,
  IconDroplet,
  IconShieldCheck,
  IconCalendarEvent
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
    title: "Servicios Basicos",
    icon: IconDroplet, 
    href: "/servicios-basicos",
  },
  {
    id: uniqueId(),
    title: "Servicios Seguridad",
    icon: IconShieldCheck, 
    href: "/servicios-seguridad",
  },
  {
    id: uniqueId(),
    title: "Eventos y Tours",
    icon: IconCalendarEvent,
    href: "/eventos-tours",
  },
];

export default Menuitems;
