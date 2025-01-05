import { useCallback, useEffect, useState } from "react";
import http from "../utils/http";
import { apiRoutes } from "../routes/api";

export const useUsers = () => {
  const [users, setUsers] = useState<any>([]);

  const get = useCallback(async () => {
    try {
      const res = await http.get(`${apiRoutes.users}?role=SELLER`);
      setUsers(res.data.data);
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return {
    users,
  };
};
