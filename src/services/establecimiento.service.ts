import axiosApi from './api.service';

// Interfaces de datos
export interface Foto {
  imageId: number;
  filename: string;
  url: string;
}

export interface Propietario {
  ownerId: number;
  name: string;
  phoneNumber: string;
  email: string;
}

export interface Categoria {
  categoryId: number;
  name: string;
}

export interface Establecimiento {
  establishmentId: number;
  name: string;
  address: string;
  description: string;
  owner: Propietario;
  category: Categoria;
  Images: Foto[];
  wazeUrl: string;
  googleMapsUrl: string;
  website: string;
  phoneNumber: string;
}

export interface EstablecimientoData {
  name: string;
  address: string;
  description: string;
  ownerId: number;
  categoryId: number;
  establishmentId?: number;
  wazeUrl: string;
  googleMapsUrl: string;
  website: string;
  phoneNumber: string;
  files?: File[]; // Nuevas imágenes a subir
}

// Obtener todos los establecimientos
export const getEstablecimientos = async (): Promise<Establecimiento[]> => {
  try {
    const response = await axiosApi.get<{data:Establecimiento[]}>('/establecimientos/listar');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching establishments:', error);
    throw error;
  }
};

// Eliminar un establecimiento
export const deleteEstablecimiento = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/establecimientos/eliminar/${id}`);
  } catch (error) {
    console.error('Error deleting establishment:', error);
    throw error;
  }
};

// Crear o actualizar un establecimiento
export const createOrUpdateEstablecimiento = async (
  establecimientoData: EstablecimientoData
): Promise<any> => {
  const formData = new FormData();

  // Agrega los campos estándar
  formData.append('name', establecimientoData.name);
  formData.append('address', establecimientoData.address);
  formData.append('description', establecimientoData.description);
  formData.append('ownerId', String(establecimientoData.ownerId));
  formData.append('categoryId', String(establecimientoData.categoryId));
  formData.append('phoneNumber', establecimientoData.phoneNumber);
  formData.append('wazeUrl', establecimientoData.wazeUrl);
  formData.append('googleMapsUrl', establecimientoData.googleMapsUrl);
  formData.append('website', establecimientoData.website);

  // Para actualización, incluye el ID del establecimiento
  if (establecimientoData.establishmentId) {
    formData.append('establishmentId', String(establecimientoData.establishmentId));
  }

  // Agrega las nuevas fotos
  if (establecimientoData.files) {
    establecimientoData.files.forEach((file) => {
      formData.append('images', file); // Clave `files` usada en el backend
    });
  }

  try {
    const response = establecimientoData.establishmentId
      ? await axiosApi.put(`/establecimientos/actualizar/${establecimientoData.establishmentId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      : await axiosApi.post('/establecimientos/agregar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    return response.data;
  } catch (error) {
    console.error('Error creating or updating the establishment:', error);
    throw error;
  }
};
