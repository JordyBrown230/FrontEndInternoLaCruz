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
];

export default Menuitems;
