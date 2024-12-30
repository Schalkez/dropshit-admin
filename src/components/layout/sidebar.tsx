import { webRoutes } from '../../routes/web';
import { BiHomeAlt2, BiCategory, BiPackage } from 'react-icons/bi';
import Icon, {
  UserOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
  BranchesOutlined,
  ShopOutlined,
} from '@ant-design/icons';

export const sidebar = [
  // {
  //   path: webRoutes.dashboard,
  //   key: webRoutes.dashboard,
  //   name: 'Dashboard',
  //   icon: <Icon component={BiHomeAlt2} />,
  // },
  {
    path: webRoutes.store,
    key: webRoutes.store,
    name: 'Người bán',
    icon: <ShopOutlined />,
  },
  {
    path: webRoutes.users,
    key: webRoutes.users,
    name: 'Khách hàng',
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.employ,
    key: webRoutes.employ,
    name: 'Nhân viên bán hàng',
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.products,
    key: webRoutes.products,
    name: 'Sản Phẩm',
    icon: <ShoppingCartOutlined />,
  },
  {
    path: webRoutes.pos,
    key: webRoutes.pos,
    name: 'POS',
    icon: <ShoppingCartOutlined />,
  },
  {
    path: webRoutes.orders,
    key: webRoutes.orders,
    name: 'Đơn hàng',
    icon: <ShoppingCartOutlined />,
  },
  // {
  //   path: webRoutes.category,
  //   key: webRoutes.category,
  //   name: 'Thể loại',
  //   icon: <BiCategory />,
  // },
  {
    path: webRoutes.branch,
    key: webRoutes.branch,
    name: 'Nhãn hàng',
    icon: <BranchesOutlined />,
  },
  {
    path: webRoutes.package,
    key: webRoutes.package,
    name: 'Gói',
    icon: <BiPackage />,
  },
  {
    path: '/method-bank',
    key: '/method-bank',
    name: 'Phương thức thanh toán',
    icon: <BiPackage />,
  },
  {
    path: '/desposit',
    key: '/desposit',
    name: 'Nạp tiền',
    icon: <BiPackage />,
  },
  {
    path: '/withdraw',
    key: '/withdraw',
    name: 'Rút tiền',
    icon: <BiPackage />,
  },
  {
    path: '/config',
    key: '/config',
    name: 'Cài Đặt',
    icon: <BiPackage />,
  },
  // {
  //   path: webRoutes.about,
  //   key: webRoutes.about,
  //   name: 'About',
  //   icon: <InfoCircleOutlined />,
  // },
];
