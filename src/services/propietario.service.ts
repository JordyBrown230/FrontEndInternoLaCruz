import axiosApi from './api.service';

export interface Propietario {
  idPropietario: number;
  nombre: string;
  telefono: string;
  correo: string;
}

export const getPropietarios = async (): Promise<Propietario[]> => {
  try {
    const response = await axiosApi.get<Propietario[]>('/propietarios');
    return response.data;
  } catch (error) {
    console.error('Error fetching propietarios:', error);
    throw error;
  }
};

export const createPropietario = async (propietarioData: Omit<Propietario, 'idPropietario'>): Promise<Propietario> => {
  try {
    const response = await axiosApi.post('/propietarios', propietarioData);
    return response.data.data; // Return the 'data' field which contains the Propietario object
  } catch (error) {
    console.error('Error creating propietario:', error);
    throw error;
  }
};
