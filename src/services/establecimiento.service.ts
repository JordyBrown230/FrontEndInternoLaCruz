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
  }
): Promise<any> => {
  const formData = new FormData();

  // Append the establishment details to the form data
  formData.append('nombre', establecimientoData.nombre);
  formData.append('direccion', establecimientoData.direccion);
  formData.append('descripcion', establecimientoData.descripcion);
  formData.append('idPropietario', String(establecimientoData.idPropietario)); // Use the actual ID now
  formData.append('idCategoria', String(establecimientoData.idCategoria));     // Use the actual ID now

  // If updating, include the idEstablecimiento
  if (establecimientoData.idEstablecimiento) {
    formData.append('idEstablecimiento', String(establecimientoData.idEstablecimiento));
  }

  // Append the photos, if provided
  if (establecimientoData.fotos) {
    Array.from(establecimientoData.fotos).forEach((file) => {
      formData.append('fotos', file);
    });
  }

  try {
    // If idEstablecimiento is provided, it's an update, otherwise it's a create
    const response = establecimientoData.idEstablecimiento
      ? await axiosApi.put(`/establecimientos/${establecimientoData.idEstablecimiento}`, formData)
      : await axiosApi.post('/establecimientos', formData);

    return response.data;
  } catch (error) {
    console.error('Error creating/updating establecimiento:', error);
    throw error;
  }
};
