import { useState, useCallback, useEffect } from "react";
import http from "../utils/http";
import { apiRoutes } from "../routes/api";

export const useBranches = () => {
  const [branches, setBranches] = useState<any[]>([]);

  const getCategories = useCallback(async () => {
    try {
      const res = await http.get(apiRoutes.branch);
      setBranches(res.data.data);
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return {
    branches,
  };
};
