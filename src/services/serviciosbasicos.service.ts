import axiosApi from './api.service';

// Definición de la interfaz para los datos de Servicio Básico

export interface Foto {
  imageId: number;
  filename: string;
  url: string;
}

export interface ServicioBasico {
  basicServiceId?: number; // Opcional para actualizar
  name: string;
  description: string;
  phoneNumber: string;
  address?: string;
  schedule?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  website?: string;
  Images?:Foto[]; // Foto como base64 string
}

export interface ServicioBasicoData {
  name: string;
  description: string;
  phoneNumber: string;
  address?: string;
  schedule?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  website?: string;
  basicServiceId?: number; // Opcional para actualizar
  files?: File[]; // La foto es un archivo opcional
}

export const getServiciosBasicos = async (): Promise<ServicioBasico[]> => {
  try {
    const response = await axiosApi.get<{data:ServicioBasico[]}>('/servicios-basicos/listar');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching servicios basicos:', error);
    throw error;
  }
};

export const deleteServicioBasico = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/servicios-basicos/eliminar/${id}`);
  } catch (error) {
    console.error('Error deleting servicio basico:', error);
    throw error;
  }
};

export const createOrUpdateServicioBasico = async (
  servicioData: ServicioBasicoData
): Promise<any> => {
  const formData = new FormData();

  // Agrega los campos obligatorios
  formData.append('name', servicioData.name);
  formData.append('description', servicioData.description);
  formData.append('phoneNumber', servicioData.phoneNumber);

  // Agrega los campos opcionales si están presentes
  if (servicioData.address) formData.append('address', servicioData.address);
  if (servicioData.schedule) formData.append('schedule', servicioData.schedule);
  if (servicioData.wazeUrl) formData.append('wazeUrl', servicioData.wazeUrl);
  if (servicioData.googleMapsUrl) formData.append('googleMapsUrl', servicioData.googleMapsUrl);
  if (servicioData.website) formData.append('website', servicioData.website);

  // Incluye el ID para actualizaciones
  if (servicioData.basicServiceId) {
    formData.append('basicServiceId', String(servicioData.basicServiceId));
  }

    // Agrega las nuevas fotos
    console.log(servicioData.files)
    if (servicioData.files) {
      servicioData.files.forEach((file) => {
        formData.append('images', file); // Clave `files` usada en el backend
      });
    }

  try {
    const response = servicioData.basicServiceId
      ? await axiosApi.put(`/servicios-basicos/actualizar/${servicioData.basicServiceId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      : await axiosApi.post('/servicios-basicos/agregar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    return response.data;
  } catch (error) {
    console.error('Error creating or updating BasicService:', error);
    throw error;
  }
};
