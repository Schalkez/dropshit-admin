import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  Menu,
  MenuProps,
  Modal,
  Upload,
  message,
} from "antd";
import { webRoutes } from "../../routes/web";
import { Link } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import {
  AppstoreOutlined,
  EditOutlined,
  FileAddOutlined,
  MailOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import { handleErrorResponse } from "../../utils";
import { AddCateForm } from "./add-cate-form";

type MenuItem = Required<MenuProps>["items"][number];

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.category}>Dashboard</Link>,
    },
    {
      key: webRoutes.category,
      title: <Link to={webRoutes.users}>Category</Link>,
    },
  ],
};

const Catgoery = () => {
  const actionRef = useRef<ActionType>();
  const [isOpen, setIsOpen] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState("");

  const [categories, setCategories] = useState([]);

  const getCate = useCallback(async () => {
    try {
      const res = await http.get(apiRoutes.category);

      setCategories(res.data.data);
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    getCate();
  }, [getCate]);

  const handleSubCate = useCallback((category: any) => {
    const subCate = category.subCategories.map((subCategory: any) => ({
      key: subCategory._id,
      label: (
        <div>
          {subCategory.name.vi}
          <EditOutlined
            style={{ paddingLeft: "10px" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          {isOpen}
        </div>
      ),
    }));

    subCate.unshift({
      key: "new-sub" + category._id,
      label: (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            setParentCategoryId(category._id);
          }}
        >
          Thêm danh mục con cho <b>{category.name.vi}</b>
        </div>
      ),
    });

    return subCate;
  }, []);

  const handledCate = useMemo(() => {
    const cateList = categories.map((category: any) => ({
      key: category._id,
      label: (
        <div>
          <b>{category.name.vi}</b>
          <EditOutlined
            style={{ paddingLeft: "10px" }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
        </div>
      ),
      icon: <MailOutlined />,
      children: handleSubCate(category),
    }));

    cateList.unshift({
      key: "new-cate",
      label: (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            setParentCategoryId("");
          }}
        >
          Thêm danh mục
        </div>
      ),
      icon: <FileAddOutlined />,
      children: undefined,
    });

    return cateList;
  }, [categories]);

  const onDelete = async (id: string) => {
    http
      .post(apiRoutes.category + "-delete", {
        id,
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        message.success("Success");
        setIsOpen(false);
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <AddCateForm
        parentCategoryId={parentCategoryId}
        getCate={getCate}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <Menu
        style={{ width: "100%" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={handledCate}
      />
    </BasePageContainer>
  );
};

export default Catgoery;
