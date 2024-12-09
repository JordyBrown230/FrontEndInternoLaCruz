import axiosApi from './api.service';

// Interfaces de datos
export interface Photo {
  imageId: number;
  filename: string;
  url: string;
}

export interface EventoTour {
  tourEventId: number;
  type: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  price?: number;
  maxCapacity?: number;
  activityType?: string;
  organizer?: string;
  specialRequirements?: string;
  estimatedDuration?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  website?: string;
  meetingPoint?: string;
  Images: Photo[];
}

export interface EventoTourData {
  type: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  price?: number;
  maxCapacity?: number;
  activityType?: string;
  organizer?: string;
  specialRequirements?: string;
  estimatedDuration?: string;
  meetingPoint?: string;
  tourEventId?: number; // Para actualización
  files?: File[]; // Nuevas fotos a subir
  wazeUrl?: string;
  googleMapsUrl?: string;
  website?: string;
}

// Obtener todos los eventos de tours
export const getEventosTours = async (): Promise<EventoTour[]> => {
  try {
    const response = await axiosApi.get<{ data: EventoTour[] }>('/eventos-tours/listar');
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tour events:', error);
    throw error;
  }
};

// Eliminar un evento de tour
export const deleteEventoTour = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/eventos-tours/eliminar/${id}`);
  } catch (error) {
    console.error('Error deleting tour event:', error);
    throw error;
  }
};

// Crear o actualizar un evento de tour
export const createOrUpdateEventoTour = async (tourEventData: EventoTourData): Promise<any> => {
  const formData = new FormData();

  // Agrega los campos estándar
  formData.append('type', tourEventData.type);
  formData.append('name', tourEventData.name);
  formData.append('description', tourEventData.description);
  formData.append('startDate', tourEventData.startDate);
  formData.append('startTime', tourEventData.startTime);
  formData.append('location', tourEventData.location);

  if (tourEventData.endDate) formData.append('endDate', tourEventData.endDate);
  if (tourEventData.endTime) formData.append('endTime', tourEventData.endTime);
  if (tourEventData.price) formData.append('price', String(tourEventData.price));
  if (tourEventData.maxCapacity) formData.append('maxCapacity', String(tourEventData.maxCapacity));
  if (tourEventData.activityType) formData.append('activityType', tourEventData.activityType);
  if (tourEventData.organizer) formData.append('organizer', tourEventData.organizer);
  if (tourEventData.specialRequirements) formData.append('specialRequirements', tourEventData.specialRequirements);
  if (tourEventData.estimatedDuration) formData.append('estimatedDuration', tourEventData.estimatedDuration);
  if (tourEventData.meetingPoint) formData.append('meetingPoint', tourEventData.meetingPoint);
  if (tourEventData.tourEventId) {
    formData.append('tourEventId', String(tourEventData.tourEventId));
  }
  if (tourEventData.wazeUrl) formData.append('wazeUrl', tourEventData.wazeUrl);
  if (tourEventData.googleMapsUrl) formData.append('googleMapsUrl', tourEventData.googleMapsUrl);
  if (tourEventData.website) formData.append('website', tourEventData.website);

  console.log(tourEventData.files)
  // Agrega las nuevas fotos
  if (tourEventData.files) {
    tourEventData.files.forEach((file) => {
      formData.append('images', file); // Clave `photos` usada en el backend
    });
  }

  try {
    const response = tourEventData.tourEventId
      ? await axiosApi.put(`/eventos-tours/actualizar/${tourEventData.tourEventId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      : await axiosApi.post('/eventos-tours/agregar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    return response.data;
  } catch (error) {
    console.error('Error creating or updating the tour event:', error);
    throw error;
  }
};
