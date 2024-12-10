# Documentación del Proyecto Next.js

## Estructura del Proyecto

El proyecto sigue la arquitectura de Next.js 13+ con enrutamiento basado en carpetas (App Router), donde cada carpeta puede contener un archivo `page.tsx` que define la ruta correspondiente.

### Características Principales

- **Rutas Dinámicas**: Generadas automáticamente por la estructura de carpetas
- **Archivo `page.tsx`**: Define el contenido de cada ruta
- **Servicios de API**: Centralizados en archivos `api.service.ts`
- **Configuración de Axios**: Configuración global para llamadas HTTP

### Estructura de Directorios

```
proyecto/
│
├── src/
│   ├── app/
│   │   ├── (DashboardLayout)/
│   │   │   ├── usuarios/
│   │   │   │   └── page.tsx     # Ruta: /usuarios
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx     # Ruta: /dashboard
│   │   │   │
│   │   │   └── page.tsx         # Ruta raíz del layout
│   │   │
│   │   └── layout.tsx           # Layout principal de la aplicación
│   │
│   ├── services/
│   │   └── api.service.ts
│   │
│   └── components/
│       └── ...
```

### Explicación de Rutas

- Cada carpeta dentro de `(DashboardLayout)` representa una ruta
- El archivo `page.tsx` dentro de cada carpeta define el contenido de esa ruta
- Por ejemplo:
  - `usuarios/page.tsx` generará la ruta `/usuarios`
  - `dashboard/page.tsx` generará la ruta `/dashboard`

## Contexto del Proyecto

El proyecto consta de **dos repositorios de frontend** desarrollados con React y TypeScript utilizando Next.js.

## Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- npm, yarn o pnpm

## Pasos de Instalación

1. Clonar los repositorios:
   ```bash
   # Repositorio Frontend Interno
   git clone https://github.com/JordyBrown230/FrontEndInternoLaCruz.git
   cd <nombre-del-proyecto-1>
   npm install

   # Repositorio Frontend externo o para usuarios finales
   git clone https://github.com/JordyBrown230/FrontEndMuni.git
   cd <nombre-del-proyecto-2>
   npm install
   ```

## Configuración de Servicios y APIs

### Configuración de Axios (`api.service.ts`)

```typescript
import axios from "axios";

// Configuraciones de servidor
export const localServer = 'http://localhost:9000/';
export const localhost = 'http://localhost:9000/sit';
// export const hostedUrl = '';  // URL de producción (comentado)

// Instancia de Axios con configuración base
const axiosApi = axios.create({
    baseURL: localhost,  // Usar localhost por defecto
});

export default axiosApi;
```

### Mejores Prácticas para Servicios

- **Centralización**: Mover todas las llamadas a APIs a archivos de servicios
- **Consistencia**: Usar la instancia de Axios configurada globalmente
- **Flexibilidad**: Cambiar fácilmente entre entornos (local, staging, producción)

## Ejecución del Proyecto

### Modo de Desarrollo

⚠️ **Nota Importante**: Hasta el momento, el proyecto solo ha sido trabajado en modo de desarrollo.

```bash
npm run dev
```

**Importante**: Por ahora, solo se ha utilizado `npm run dev` para ejecutar la aplicación. No se han realizado pruebas de construcción o despliegue en producción.

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Guía de Axios](https://axios-http.com/docs/intro)
- [Configuración de Variables de Entorno en Next.js](https://nextjs.org/docs/basic-features/environment-variables)

## Despliegue

Recomendado: Plataforma Vercel
- [Guía de Despliegue de Next.js](https://nextjs.org/docs/deployment)

## Recomendaciones de Implementación

### Estado Actual de los Servicios de API

🚨 **Situación Actual**:
- El proyecto cuenta con un archivo `api.service.ts` como punto central de conexión con el backend
- No todos los componentes siguen la estructura centralizada de servicios
- Algunos componentes requieren modificaciones directas para cambios de URL

### Mejoras Propuestas

1. **Migración Centralizada de Servicios**
   - Migrar gradualmente todas las llamadas de API a los servicios centralizados
   - Unificar la gestión de endpoints
   - Facilitar el mantenimiento del código
   - Reducir la duplicidad de implementaciones

2. **Estrategia de Implementación**
   - Identificar componentes con llamadas API dispersas
   - Refactorizar para usar `api.service.ts`
   - Establecer guías de implementación para nuevos desarrollos

3. **Beneficios Esperados**
   - Código más mantenible
   - Gestión centralizada de configuraciones
   - Facilidad para cambios globales de configuración
   - Mejora en la consistencia del proyecto
```
