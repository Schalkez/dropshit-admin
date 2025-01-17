import { webRoutes } from "../../routes/web";
import { BiHomeAlt2, BiCategory, BiPackage } from "react-icons/bi";
import Icon, {
  UserOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
  BranchesOutlined,
  ShopOutlined,
  WindowsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: "Bảng điều khiển",
    icon: <Icon component={BiHomeAlt2} />,
  },
  {
    path: webRoutes.store,
    key: webRoutes.store,
    name: "Người bán",
    icon: <ShopOutlined />,
  },
  {
    path: webRoutes.users,
    key: webRoutes.users,
    name: "Khách hàng",
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.employ,
    key: webRoutes.employ,
    name: "Nhân viên bán hàng",
    icon: <UserOutlined />,
  },
  {
    path: webRoutes.products,
    key: webRoutes.products,
    name: "Sản Phẩm",
    icon: <ShoppingCartOutlined />,
  },
  {
    path: webRoutes.category,
    key: webRoutes.category,
    name: "Danh mục sản phẩm",
    icon: <UnorderedListOutlined />,
  },
  {
    path: webRoutes.pos,
    key: webRoutes.pos,
    name: "POS",
    icon: <ShoppingCartOutlined />,
  },
  {
    path: webRoutes.orders,
    key: webRoutes.orders,
    name: "Đơn hàng",
    icon: <ShoppingCartOutlined />,
  },
  {
    path: webRoutes.branch,
    key: webRoutes.branch,
    name: "Nhãn hiệu",
    icon: <BranchesOutlined />,
  },
  // {
  //   path: webRoutes.package,
  //   key: webRoutes.package,
  //   name: "Gói",
  //   icon: <BiPackage />,
  // },
  // {
  //   path: "/method-bank",
  //   key: "/method-bank",
  //   name: "Phương thức thanh toán",
  //   icon: <BiPackage />,
  // },
  {
    path: "/deposit",
    key: "/deposit",
    name: "Nạp tiền",
    icon: <BiPackage />,
  },
  {
    path: "/withdraw",
    key: "/withdraw",
    name: "Rút tiền",
    icon: <BiPackage />,
  },
  {
    path: "/config",
    key: "/config",
    name: "Cài Đặt",
    icon: <BiPackage />,
  },
  {
    path: webRoutes.trust,
    key: webRoutes.trust,
    name: "Điểm tín nhiệm",
    icon: <InfoCircleOutlined />,
  },
  {
    path: webRoutes.daily_access,
    key: webRoutes.daily_access,
    name: "Lượt truy cập",
    icon: <InfoCircleOutlined />,
  },
];
