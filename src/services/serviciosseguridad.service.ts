import axiosApi from './api.service';

// Definición de la interfaz para los datos de Servicio de Seguridad
export interface ServicioSeguridad {
  idServicioSeguridad: number;
  nombre: string;
  descripcion: string;
  telefono: string;
  direccion?: string;
  horario?: string;
  urlWaze?: string;
  urlGoogleMaps?: string;
  website?: string;
  foto?: string; // Foto como base64 string
}

export interface ServicioSeguridadData {
  nombre: string;
  descripcion: string;
  telefono: string;
  direccion?: string;
  horario?: string;
  urlWaze?: string;
  urlGoogleMaps?: string;
  website?: string;
  idServicioSeguridad?: number; // Opcional para actualizar
  foto?: File; // La foto es un archivo opcional
}

export const getServiciosSeguridad = async (): Promise<ServicioSeguridad[]> => {
  try {
    const response = await axiosApi.get<ServicioSeguridad[]>('/servicios-seguridad');
    return response.data;
  } catch (error) {
    console.error('Error fetching servicios seguridad:', error);
    throw error;
  }
};

export const deleteServicioSeguridad = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/eliminar-servicio-seguridad/${id}`);
  } catch (error) {
    console.error('Error deleting servicio seguridad:', error);
    throw error;
  }
};

export const createOrUpdateServicioSeguridad = async (
  servicioData: ServicioSeguridadData
): Promise<any> => {
  const formData = new FormData();

  formData.append('nombre', servicioData.nombre);
  formData.append('descripcion', servicioData.descripcion);
  formData.append('telefono', servicioData.telefono);
  if (servicioData.direccion) formData.append('direccion', servicioData.direccion);
  if (servicioData.horario) formData.append('horario', servicioData.horario);
  if (servicioData.urlWaze) formData.append('urlWaze', servicioData.urlWaze);
  if (servicioData.urlGoogleMaps) formData.append('urlGoogleMaps', servicioData.urlGoogleMaps);
  if (servicioData.website) formData.append('website', servicioData.website);

  if (servicioData.idServicioSeguridad) {
    formData.append('idServicioSeguridad', String(servicioData.idServicioSeguridad));
  }

  if (servicioData.foto) {
    formData.append('foto', servicioData.foto); // Manejo de foto
  }

  try {
    const response = await axiosApi.post('/servicios-seguridad', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating servicio seguridad:', error);
    throw error;
  }
};
