import { StringLiteral } from 'typescript';
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
  urlWaze:string;
  urlGoogleMaps:string;
  website:string;
  telefono:string;
}

export interface EstablecimientoData {
  nombre: string;
  direccion: string;
  descripcion: string;
  idPropietario: number;
  idCategoria: number;
  idEstablecimiento?: number;
  urlWaze:string;
  urlGoogleMaps:string;
  website:string;
  telefono:string;
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
    idEstablecimiento?: number; // Opcional para actualización
    fotos?: File[];
    existingFotosToKeep?: number[];
    fotosParaEliminar?: number[]; // Nueva lista para fotos a eliminar
    telefono: string;
    urlWaze: string;
    urlGoogleMaps: string;
    website: string;
  }
): Promise<any> => {
  const formData = new FormData();

  // Agrega los campos estándar
  formData.append('nombre', establecimientoData.nombre);
  formData.append('direccion', establecimientoData.direccion);
  formData.append('descripcion', establecimientoData.descripcion);
  formData.append('idPropietario', String(establecimientoData.idPropietario)); 
  formData.append('idCategoria', String(establecimientoData.idCategoria));    
  formData.append('telefono', establecimientoData.telefono);
  formData.append('urlWaze', establecimientoData.urlWaze);
  formData.append('urlGoogleMaps', establecimientoData.urlGoogleMaps);
  formData.append('website', establecimientoData.website);

  // Para actualización, incluye el ID del establecimiento
  if (establecimientoData.idEstablecimiento) {
    formData.append('idEstablecimiento', String(establecimientoData.idEstablecimiento));
  }

  // Agrega las nuevas fotos
  if (establecimientoData.fotos) {
    establecimientoData.fotos.forEach((file) => {
      formData.append('fotos', file);
    });
  }

  // Agrega fotos para mantener
  if (establecimientoData.existingFotosToKeep) {
    establecimientoData.existingFotosToKeep.forEach((id) => {
      formData.append('existingFotosToKeep[]', String(id));
    });
  }

  // Agrega fotos para eliminar
  if (establecimientoData.fotosParaEliminar) {
    establecimientoData.fotosParaEliminar.forEach((id) => {
      formData.append('fotosParaEliminar[]', String(id));
    });
  }

  try {
    const response = await axiosApi.post('/establecimientos', formData);
    return response.data;
  } catch (error) {
    console.error('Error creando o actualizando el establecimiento:', error);
    throw error;
  }
};

