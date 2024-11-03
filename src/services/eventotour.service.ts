import axiosApi from './api.service';

export interface FotoEventoTour {
  idFoto: number;
  foto: string;
}

export interface EventoTour {
  idEventoTour: number;
  tipo: string; 
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  precio?: number;
  capacidadMaxima?: number;
  tipoActividad?: string;
  organizador?: string;
  requerimientosEspeciales?: string;
  duracionEstimada?: string;
  urlWaze?: string;
  urlGoogleMaps?: string;
  website?: string;
  puntoEncuentro?: string;
  fotosEventoTour: FotoEventoTour[];
}

// Interfaz para los datos de creación o actualización de un evento o tour
export interface EventoTourData {
  tipo: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  horaInicio: string;
  horaFin?: string;
  ubicacion: string;
  precio?: number;
  capacidadMaxima?: number;
  tipoActividad?: string;
  organizador?: string;
  requerimientosEspeciales?: string;
  duracionEstimada?: string;
  puntoEncuentro?: string;
  idEventoTour?: number; 
  fotos?: File[];
  existingFotosToKeep?: number[];
  fotosParaEliminar?: number[];
  urlWaze?: string;
  urlGoogleMaps?: string;
  website?: string;
}

// Servicio para obtener todos los eventos y tours
export const getEventosTours = async (): Promise<EventoTour[]> => {
  try {
    const response = await axiosApi.get<EventoTour[]>('/eventos-tours');
    return response.data;
  } catch (error) {
    console.error('Error fetching eventos/tours:', error);
    throw error;
  }
};

// Servicio para eliminar un evento o tour
export const deleteEventoTour = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/eliminar-evento-tour/${id}`);
  } catch (error) {
    console.error('Error deleting evento/tour:', error);
    throw error;
  }
};

// Servicio para crear o actualizar un evento o tour
export const createOrUpdateEventoTour = async (
  eventoTourData: EventoTourData
): Promise<any> => {
  const formData = new FormData();

  formData.append('tipo', eventoTourData.tipo);
  formData.append('nombre', eventoTourData.nombre);
  formData.append('descripcion', eventoTourData.descripcion);
  formData.append('fechaInicio', eventoTourData.fechaInicio);
  formData.append('horaInicio', eventoTourData.horaInicio);
  formData.append('ubicacion', eventoTourData.ubicacion);

  if (eventoTourData.fechaFin) formData.append('fechaFin', eventoTourData.fechaFin);
  if (eventoTourData.horaFin) formData.append('horaFin', eventoTourData.horaFin);
  if (eventoTourData.precio) formData.append('precio', String(eventoTourData.precio));
  if (eventoTourData.capacidadMaxima) formData.append('capacidadMaxima', String(eventoTourData.capacidadMaxima));
  if (eventoTourData.tipoActividad) formData.append('tipoActividad', eventoTourData.tipoActividad);
  if (eventoTourData.organizador) formData.append('organizador', eventoTourData.organizador);
  if (eventoTourData.requerimientosEspeciales) formData.append('requerimientosEspeciales', eventoTourData.requerimientosEspeciales);
  if (eventoTourData.duracionEstimada) formData.append('duracionEstimada', eventoTourData.duracionEstimada);
  if (eventoTourData.puntoEncuentro) formData.append('puntoEncuentro', eventoTourData.puntoEncuentro);
  if (eventoTourData.idEventoTour) formData.append('idEventoTour', String(eventoTourData.idEventoTour));
  if (eventoTourData.urlWaze) formData.append('urlWaze', eventoTourData.urlWaze);
  if (eventoTourData.urlGoogleMaps) formData.append('urlGoogleMaps', eventoTourData.urlGoogleMaps);
  if (eventoTourData.website) formData.append('website', eventoTourData.website);
  
  if (eventoTourData.fotos) {
    Array.from(eventoTourData.fotos).forEach((file) => {
      formData.append('fotos', file);
    });
  }

  // Agrega fotos para mantener
  if (eventoTourData.existingFotosToKeep) {
    eventoTourData.existingFotosToKeep.forEach((id) => {
      formData.append('existingFotosToKeep[]', String(id));
    });
  }

  // Agrega fotos para eliminar
  if (eventoTourData.fotosParaEliminar) {
    eventoTourData.fotosParaEliminar.forEach((id) => {
      formData.append('fotosParaEliminar[]', String(id));
    });
  }

  try {
    const response = await axiosApi.post('/agregar-evento-tour', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating/updating evento/tour:', error);
    throw error;
  }
};
