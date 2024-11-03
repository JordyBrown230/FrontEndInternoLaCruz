import { IconAccessibleOff, IconAccessibleOffFilled, IconAlertOctagon, IconBone, IconCursorText, IconParachute, IconPlane, IconPrescription, IconUser, IconUserBolt, IconUserDollar, IconUserEdit } from "@tabler/icons-react";
import {
  IconHome,
  IconBuilding,
  IconMap,
  IconBus,
  IconVideo,
  IconForms,
  IconAccessible,
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
    title: "Crear User",
    icon: IconUser,
    href: "/crud-userU",
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
    title: "Info Legal-Regulatoria",
    icon: IconForms,
    href: "/crud-InfoLegalRegulatoria",
  },
  {
    id: uniqueId(),
    title: "Educación Turística",
    icon: IconUserEdit,
    href: "/crud-EducacionTuristica",
  },
  {
    id: uniqueId(),
    title: "Zonas de Riesgo",
    icon: IconAlertOctagon,
    href: "/crud-zonasriesgo",
  },
  {
    id: uniqueId(),
    title: "Sitios Arqueológicos",
    icon: IconBone,
    href: "/crud-sitiosarqueologicos",
  },
  {
    id: uniqueId(),
    title: "Destino Turístico",
    icon: IconPlane,
    href: "/crud-guiaViaje",
  },
];

export default Menuitems;
