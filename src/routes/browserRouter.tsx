import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorPage from '../components/errorPage';
import Layout from '../components/layout';
import Redirect from '../components/layout/Redirect';
import NotFoundPage from '../components/notfoundPage';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '../components/loader/progressBar';
import RequireAuth from './requireAuth';
import Login from '../components/auth/Login';
import About from '../components/demo-pages/about';
import Desposit from '../components/deposit';
import Config from '../components/config';
import Withdraw from '../components/withdraw';

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Dashboard = loadable(() => import('../components/dashboard'), {
  fallback: fallbackElement,
});

const Pos = loadable(() => import('../components/pos'), {
  fallback: fallbackElement,
});

const Orders = loadable(() => import('../components/Orders'), {
  fallback: fallbackElement,
});
const OrderDetail = loadable(() => import('../components/Orders/OrderDetail'), {
  fallback: fallbackElement,
});

const Users = loadable(() => import('../components/users'), {
  fallback: fallbackElement,
});
const Store = loadable(() => import('../components/store'), {
  fallback: fallbackElement,
});
const Employee = loadable(() => import('../components/employee'), {
  fallback: fallbackElement,
});
const Products = loadable(() => import('../components/products'), {
  fallback: fallbackElement,
});
const Category = loadable(() => import('../components/category'), {
  fallback: fallbackElement,
});
const Methodbank = loadable(() => import('../components/bank-method'), {
  fallback: fallbackElement,
});
const Branch = loadable(() => import('../components/branch'), {
  fallback: fallbackElement,
});

const AddProduct = loadable(
  () => import('../components/products/add-product'),
  {
    fallback: fallbackElement,
  }
);
const Package = loadable(() => import('../components/package'), {
  fallback: fallbackElement,
});

export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

  // auth routes
  {
    element: <AuthLayout />,
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.login,
        element: <Login />,
      },
    ],
  },

  // protected routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.store,
        element: <Store />,
      },
      {
        path: webRoutes.users,
        element: <Users />,
      },
      {
        path: webRoutes.employ,
        element: <Employee />,
      },
      {
        path: webRoutes.products,
        element: <Products />,
      },
      {
        path: webRoutes.orders,
        element: <Orders />,
      },
      {
        path: '/order-detail',
        element: <OrderDetail />,
      },
      {
        path: '/config',
        element: <Config />,
      },
      {
        path: webRoutes.pos,
        element: <Pos />,
      },
      {
        path: '/method-bank',
        element: <Methodbank />,
      },
      {
        path: '/desposit',
        element: <Desposit />,
      },
      {
        path: '/withdraw',
        element: <Withdraw />,
      },
      {
        path: webRoutes.add_products,
        element: <AddProduct />,
      },
      {
        path: webRoutes.category,
        element: <Category />,
      },
      {
        path: webRoutes.branch,
        element: <Branch />,
      },
      {
        path: webRoutes.package,
        element: <Package />,
      },
      {
        path: webRoutes.about,
        element: <About />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
