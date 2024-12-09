import axiosApi from './api.service';

export interface Category {
  categoryId: number;
  name: string;
}

export const getCategorias = async (): Promise<Category[]> => {
  try {
    const response = await axiosApi.get<{data:Category[]}>('/categorias/listar');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategoria = async (categoriaData: Omit<Category, 'categoryId'>): Promise<Category> => {
  try {
    const response = await axiosApi.post('/categorias/agregar', categoriaData);
    return response.data.data; // Return the 'data' field which contains the Categoria object
  } catch (error) {
    console.error('Error creating categoria:', error);
    throw error;
  }
};

export const deleteCategoria = async (id:any) => {
  try {
    const response = await axiosApi.delete(`/categorias/eliminar/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error deleting the category:", error);
    throw error; 
  }
};
