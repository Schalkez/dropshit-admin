import { useState, useCallback, useEffect } from "react";
import http from "../utils/http";
import { apiRoutes } from "../routes/api";

export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  const getCategories = useCallback(async () => {
    try {
      const res = await http.get(apiRoutes.category);
      setCategories(res.data.data);
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return {
    categories,
  };
};
