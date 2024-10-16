import axiosApi from './api.service';

// Definición de la interfaz para los datos de establecimiento
export interface Foto {
  idFoto: number;
  foto: string;
}

export interface Propietario {
  idPropietario: number;
  nombre: string;
  telefono: string;
  correo: string;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Establecimiento {
  idEstablecimiento: number;
  nombre: string;
  direccion: string;
  descripcion: string;
  propietario: Propietario;
  categoria: Categoria;
  fotosEstablecimiento: Foto[];
}

export interface EstablecimientoData {
  nombre: string;
  direccion: string;
  descripcion: string;
  idPropietario: number;
  idCategoria: number;
  idEstablecimiento?: number;
  fotos?: File[];
  existingFotosToKeep?: number[]; // IDs of existing photos to retain when updating
}

export const getEstablecimientos = async (): Promise<Establecimiento[]> => {
  try {
    const response = await axiosApi.get<Establecimiento[]>('/establecimientos');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching establecimientos:', error);
    throw error;
  }
};

export const deleteEstablecimiento = async (id: number): Promise<void> => {
  try {
    await axiosApi.delete(`/eliminar-establecimiento/${id}`);
  } catch (error) {
    console.error('Error deleting establecimiento:', error);
    throw error;
  }
};

export const createOrUpdateEstablecimiento = async (
  establecimientoData: {
    nombre: string;
    direccion: string;
    descripcion: string;
    idPropietario: number;
    idCategoria: number;
    idEstablecimiento?: number; // Optional for update
    fotos?: File[]; 
    existingFotosToKeep?: number[]; // Agregar esta propiedad
  }
): Promise<any> => {
  const formData = new FormData();

  formData.append('nombre', establecimientoData.nombre);
  formData.append('direccion', establecimientoData.direccion);
  formData.append('descripcion', establecimientoData.descripcion);
  formData.append('idPropietario', String(establecimientoData.idPropietario)); 
  formData.append('idCategoria', String(establecimientoData.idCategoria));    

  if (establecimientoData.idEstablecimiento) {
    formData.append('idEstablecimiento', String(establecimientoData.idEstablecimiento));
  }

  if (establecimientoData.fotos) {
    Array.from(establecimientoData.fotos).forEach((file) => {
      formData.append('fotos', file);
    });
  }

  try {
    const response = await axiosApi.post('/establecimientos', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating establecimiento:', error);
    throw error;
  }
};
