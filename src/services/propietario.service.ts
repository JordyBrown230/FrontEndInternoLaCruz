import axiosApi from './api.service';

export interface Owner {
  ownerId: number;
  name: string;
  phoneNumber: string;
  email: string;
}

export const getPropietarios = async (): Promise<Owner[]> => {
  try {
    const response = await axiosApi.get<{data:Owner[]}>('/propietarios/listar');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching propietarios:', error);
    throw error;
  }
};

export const createPropietario = async (propietarioData: Omit<Owner, 'ownerId'>): Promise<Owner> => {
  try {
    const response = await axiosApi.post('/propietarios/agregar', propietarioData);
    return response.data.data; // Return the 'data' field which contains the Propietario object
  } catch (error) {
    console.error('Error creating propietario:', error);
    throw error;
  }
};
