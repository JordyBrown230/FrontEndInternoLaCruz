import axiosApi from './api.service';

export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await axiosApi.get<Categoria[]>('/categorias');
    return response.data;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    throw error;
  }
};

export const createCategoria = async (categoriaData: Omit<Categoria, 'idCategoria'>): Promise<Categoria> => {
  try {
    const response = await axiosApi.post('/categorias', categoriaData);
    return response.data.data; // Return the 'data' field which contains the Categoria object
  } catch (error) {
    console.error('Error creating categoria:', error);
    throw error;
  }
};
