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
  AppstoreAddOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  MailOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import { handleErrorResponse } from "../../utils";
import { AddCateForm } from "./add-cate-form";

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
        <div className="flex justify-between">
          <b>{subCategory.name.vi}</b>
          <div className="pr-10">
            {/* <EditOutlined
              style={{ paddingLeft: "20px" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            /> */}

            <DeleteOutlined
              style={{ paddingLeft: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                deleteCate(category._id, subCategory._id);
              }}
            />
          </div>
        </div>
      ),
      icon: <img width={16} height={16} src={subCategory.img} alt="" />,
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
          <AppstoreAddOutlined /> Thêm danh mục con cho{" "}
          <b>{category.name.vi}</b>
        </div>
      ),
    });

    return subCate;
  }, []);

  const handledCate = useMemo(() => {
    const cateList = categories.map((category: any) => ({
      key: category._id,
      label: (
        <div className="flex justify-between">
          <b>{category.name.vi}</b>
          <div className="pr-10">
            {/* <EditOutlined
              style={{ paddingLeft: "20px" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            /> */}

            <DeleteOutlined
              style={{ paddingLeft: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                deleteCate(category._id);
              }}
            />
          </div>
        </div>
      ),
      icon: <img width={16} height={16} src={category.img} alt="" />,
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

  const deleteCate = useCallback(async (id: string, subCateId = "") => {
    try {
      await http.delete(
        `${apiRoutes.category}/${id}${subCateId ? "/" + subCateId : ""}`
      );

      message.success("Success");

      getCate();
    } catch (error) {
      handleErrorResponse(error);
    }
  }, []);

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      {isOpen && (
        <AddCateForm
          parentCategoryId={parentCategoryId}
          getCate={getCate}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
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
