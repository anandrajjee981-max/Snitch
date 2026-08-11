import { searchProducts } from "../service/search.api";
import { setSearchResults, setIsSearching } from "../search.slice";
import { useDispatch } from "react-redux";

const usesearch = () => {
  const dispatch = useDispatch();

  async function handlesearch(searchQuery) {
    const normalizedQuery = searchQuery?.trim() || "";

    if (!normalizedQuery) {
      dispatch(setSearchResults([]));
      dispatch(setIsSearching(false));
      return;
    }

    try {
      dispatch(setIsSearching(true));
      const res = await searchProducts(normalizedQuery);
      const payload = res?.data?.data || res?.data || [];
      dispatch(setSearchResults(payload));
    } catch (err) {
      console.error(err);
      dispatch(setSearchResults([]));
    } finally {
      dispatch(setIsSearching(false));
    }
  }

  function clearSearch() {
    dispatch(setSearchResults([]));
    dispatch(setIsSearching(false));
  }

  return { handlesearch, clearSearch };
};

export default usesearch;


