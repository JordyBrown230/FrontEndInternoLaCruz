import { IconAccessibleOff, IconAccessibleOffFilled, IconPrescription, IconUser, IconUserBolt, IconUserDollar, IconUserEdit } from "@tabler/icons-react";
import {
  IconHome,
  IconBuilding,
  IconMap,
  IconBus,
  IconVideo,
  IconForms,
  IconAccessible,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Inicio",
  },
  {
    id: uniqueId(),
    title: "Crear User",
    icon: IconUser,
    href: "/crud-userU",
  },
  {
    id: uniqueId(),
    title: "Empresas",
    icon: IconBuilding,
    href: "/crud-empresas",
  },
  {
    id: uniqueId(),
    title: "Atracciones Turísticas",
    icon: IconMap,
    href: "/crud-atraccionesTuristicas",
  },
  {
    id: uniqueId(),
    title: "Transportes",
    icon: IconBus,
    href: "/crud-transportes",
  },
  {
    id: uniqueId(),
    title: "Multimedia",
    icon: IconVideo,
    href: "/crud-materiaMulti",
  },
  {
    id: uniqueId(),
    title: "Información Legal-Regulatoria",
    icon: IconForms,
    href: "/crud-InfoLegalRegulatoria",
  },
  {
    id: uniqueId(),
    title: "Educación Turística",
    icon: IconUserEdit,
    href: "/crud-EducacionTuristica",
  },
];

export default Menuitems;
