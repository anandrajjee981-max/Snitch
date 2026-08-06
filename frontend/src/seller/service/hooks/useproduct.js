import { getproduct, submitProducts, allproduct, submitVariant, getSellerProductById, editproduct, editstock, editvariantstock } from "../service/product.api";
import { addproduct ,allproductuser} from '../product.slice';
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

  const handleuserproduct = async () => {
    const res = await allproduct();
    const products = Array.isArray(res.data?.product)
      ? res.data.product
      : Array.isArray(res.data)
        ? res.data
        : [];

    dispatch(allproductuser(products));
  };

  const handlesubmitvariant = async (productId, formData) => {
    try {
      const response = await submitVariant(productId, formData);
      return response.data;
    } catch (error) {
      console.error("Variant submit error:", error.response?.data || error);
      throw error;
    }
  };

  const handlegetproductbyid = async (productId) => {
    try {
      const response = await getSellerProductById(productId);
      return response.data;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw error;
    }
  };
  
  const handleeditproduct = async (productId, formData) => {
    try {
      const response = await editproduct(productId, formData);
      return response.data;
    } catch (error) {
      console.error("Error editing product:", error);
      throw error; 
    }
  };

  const handleeditstock = async (productId, data) => {
    try {
      const response = await editstock(productId, data);
      return response.data;
    } catch (error) {
      console.error("Error editing stock:", error);
      throw error;
    }
  };
  const handleeditvariantstock = async (productId, variantId, data) => {
    try {
      const response = await editvariantstock(productId, variantId, data);  
      return response.data;
    } catch (error) { 
      console.error("Error editing variant stock:", error);
      throw error;
    }
  };

  return { handleaddproduct, handlegetproduct, handleuserproduct, handlesubmitvariant, handlegetproductbyid, handleeditproduct, handleeditstock, handleeditvariantstock };
};

export default useproduct;
