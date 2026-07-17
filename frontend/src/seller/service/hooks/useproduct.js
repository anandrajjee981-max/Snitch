import { getproduct, submitProducts } from "../service/product.api";
import { addproduct } from '../product.slice';
import { useDispatch } from "react-redux";

const useproduct = () => {
  const dispatch = useDispatch();

  const handleaddproduct = async (formDataToSend) => {
    try {
      const response = await submitProducts(formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      if (response && response.data) {
        dispatch(addproduct(response.data)); // Redux slice helper function ko call kiya
        return response.data;
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      throw error;
    }
  };

  const handlegetproduct = async () => {
    try {
      const response = await getproduct();
      return response.data; 
    } catch (error) {
      console.error("Error fetching dynamic products:", error);
      throw error; 
    }
  };

  return { handleaddproduct, handlegetproduct };
};

export default useproduct;