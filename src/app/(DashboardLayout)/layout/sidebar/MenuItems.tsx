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
    title: "CRUD Empresas",
    icon: IconBuilding,
    href: "/crud-empresas",
  },
  {
    id: uniqueId(),
    title: "Atracciones Turísticas",
    icon: IconBuilding,
    href: "/crud-atraccionesTuristicas",
  },
];

export default Menuitems;
