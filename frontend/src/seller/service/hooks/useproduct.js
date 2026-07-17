import { submitProducts } from "../service/product.api";
import { addproduct } from '../product.slice';
import { useDispatch } from "react-redux";

const useproduct = () => {
  const dispatch = useDispatch();


const handleaddproduct = async (formDataToSend) => {
  try {
    const response = await submitProducts( formDataToSend, {
      headers: {
        // Axios automatically sets this when receiving FormData, 
        // but explicitly adding it prevents errors in some setups.
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error);
    throw error;
  }
};

  return { handleaddproduct };
};

export default useproduct;





















