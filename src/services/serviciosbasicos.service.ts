import axiosApi from './api.service';

// Definición de la interfaz para los datos de Servicio Básico
export interface ServicioBasico {
  idServicioBasico: number;
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

export interface ServicioBasicoData {
  nombre: string;
  descripcion: string;
  telefono: string;
  direccion?: string;
  horario?: string;
  urlWaze?: string;
  urlGoogleMaps?: string;
  website?: string;
  idServicioBasico?: number; // Opcional para actualizar
  foto?: File; // La foto es un archivo opcional
  eliminarFoto?: boolean; // Nueva bandera para indicar si se debe eliminar la imagen
}

export const getServiciosBasicos = async (): Promise<ServicioBasico[]> => {
  try {
    const response = await axiosApi.get<ServicioBasico[]>('/servicios-basicos');
    return response.data;
  } catch (error) {
    console.error('Error fetching servicios basicos:', error);
    throw error;
  }
};

export const deleteServicioBasico = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/eliminar-servicio-basico/${id}`);
  } catch (error) {
    console.error('Error deleting servicio basico:', error);
    throw error;
  }
};

export const createOrUpdateServicioBasico = async (
  servicioData: ServicioBasicoData
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

  if (servicioData.idServicioBasico) {
    formData.append('idServicioBasico', String(servicioData.idServicioBasico));
  }

  if (servicioData.foto) {
    formData.append('foto', servicioData.foto); // Manejo de foto
  }

  // Añade la bandera eliminarFoto si es true
  if (servicioData.eliminarFoto) {
    formData.append('eliminarFoto', 'true');
  }

  try {
    const response = servicioData.idServicioBasico
      ? await axiosApi.put(`/servicios-basicos/${servicioData.idServicioBasico}`, formData)
      : await axiosApi.post('/servicios-basicos', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating servicio basico:', error);
    throw error;
  }
};
