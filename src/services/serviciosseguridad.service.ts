import axiosApi from './api.service';

// Definición de la interfaz para los datos de Servicio de Seguridad
export interface Foto {
  imageId: number;
  filename: string;
  url: string;
}

export interface ServicioSeguridad {
  securityServiceId?: number; // Optional for updating
  name: string;
  description: string;
  phoneNumber: string;
  address?: string;
  schedule?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  website?: string;
  Images?: Foto[]; // Arreglo de fotos asociadas al servicio
}

export interface ServicioSeguridadData {
  securityServiceId?: number; // Optional for updating
  name: string;
  description: string;
  phoneNumber: string;
  address?: string;
  schedule?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  website?: string;
  files?: File[]; // Nuevas imágenes a subir
}

export const getServiciosSeguridad = async (): Promise<ServicioSeguridad[]> => {
  try {
    const response = await axiosApi.get<{ data: ServicioSeguridad[] }>('/servicios-seguridad/listar');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching servicios de seguridad:', error);
    throw error;
  }
};

export const deleteServicioSeguridad = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/servicios-seguridad/eliminar/${id}`);
  } catch (error) {
    console.error('Error deleting servicio de seguridad:', error);
    throw error;
  }
};

export const createOrUpdateServicioSeguridad = async (
  servicioData: ServicioSeguridadData
): Promise<any> => {
  const formData = new FormData();

  // Agrega los campos obligatorios
  formData.append('name', servicioData.name);
  formData.append('description', servicioData.description);
  formData.append('phoneNumber', servicioData.phoneNumber);

  // Agrega los campos opcionales si están presentes
  if (servicioData.address) formData.append('direction', servicioData.address);
  if (servicioData.schedule) formData.append('schedule', servicioData.schedule);
  if (servicioData.wazeUrl) formData.append('wazeUrl', servicioData.wazeUrl);
  if (servicioData.googleMapsUrl) formData.append('googleMapsUrl', servicioData.googleMapsUrl);
  if (servicioData.website) formData.append('website', servicioData.website);

  // Incluye el ID para actualizaciones
  if (servicioData.securityServiceId) {
    formData.append('securityServiceId', String(servicioData.securityServiceId));
  }

  // Agrega las nuevas fotos
  if (servicioData.files) {
    servicioData.files.forEach((file) => {
      formData.append('images', file); // Clave `images` usada en el backend
    });
  }
  try {
    const response = servicioData.securityServiceId
      ? await axiosApi.put(`/servicios-seguridad/actualizar/${servicioData.securityServiceId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      : await axiosApi.post('/servicios-seguridad/agregar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    return response.data;
  } catch (error) {
    console.error('Error creating or updating servicio de seguridad:', error);
    throw error;
  }
};
