import { API_URL } from '../utils';

export const apiRoutes = {
  login: `${API_URL}/auth/signinAdmin`,
  logout: `${API_URL}/profile/logout`,
  users: `${API_URL}/admin/users`,
  reviews: `${API_URL}/unknown`,
  category: `${API_URL}/admin/category`,
  branch: `${API_URL}/admin/branch`,
  product: `${API_URL}/admin/product`,
  addEmployee: `${API_URL}/admin/addEmployee`,
  getPackage: `${API_URL}/admin/package`,
  addpackage: `${API_URL}/admin/add-package`,
  deletePackage: `${API_URL}/admin/delete-package`,
  defaultPackage: `${API_URL}/admin/add-default-package`
};
