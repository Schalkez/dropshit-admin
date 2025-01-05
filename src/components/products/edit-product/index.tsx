import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { UploadOutlined, LeftOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { webRoutes } from "../../../routes/web";
import http from "../../../utils/http";
import { apiRoutes } from "../../../routes/api";
import { Option } from "antd/es/mentions";
import { UploadProps } from "antd/lib/upload";
import { handleErrorResponse } from "../../../utils";
import { RootState, store } from "../../../store";
import { useCategories } from "../../../hooks/useCategories";
import { useBranches } from "../../../hooks/useBranches";
import _, { first, flatMap } from "lodash";

const EditProduct = ({ editProduct, setIsEditModalOpen, reload }: any) => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [product, setProduct] = useState<any>();

  useEffect(() => {
    setProduct({ ...editProduct });

    editProduct.images.forEach((image: any, index: number) => {
      setImages((prev: any) => ({
        ...prev,
        [index]: image,
      }));
    });
  }, [editProduct, setProduct]);

  const { categories } = useCategories();
  const { branches } = useBranches();
  console.log(product);
  const allSubcategories = flatMap(categories, (category: any) => [
    ...category?.subCategories.map((subCategory: any) => ({
      ...subCategory,
      parentCategoryId: category._id,
    })),
  ]);

  const state: RootState = store.getState();
  const admin = state.admin as any;
  const navigate = useNavigate();

  const props1: UploadProps = {
    name: "file",
    action: `${import.meta.env.VITE_API_URL}/upload/file`,
    beforeUpload: (file) => {
      setImgLoading(true);
      const isPNG = file.type === "image/png" || "image/jpeg";
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
  };

  const onSubmit = (form: any) => {
    console.log(form);

    setLoading(true);

    http
      .patch(`${apiRoutes.products}/${product._id}`, {
        branch: product.branch,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        category: product.category._id,
        subCategory: product.subCategory._id,
        images: Object.values(images),
        description: product.description,
        user: admin?.user?._id,
      })
      .then((response) => {
        reload();
        message.success("Success");
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form onFinish={onSubmit} disabled={loading}>
      <Row>
        <Col span={24}>
          <Form.Item required label="Tên sản phẩm" name={"name"}>
            <div className="hidden">{product?.name}</div>
            <Input
              required
              key={product?.name}
              value={product?.name}
              onChange={(e) =>
                setProduct((prev: any) => ({ ...prev, name: e.target.value }))
              }
              className="h-[40px]"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item required label="Số lượng" name={"quantity"}>
            <div className="hidden">{product?.quantity}</div>
            <Input
              defaultValue={4999}
              value={product?.quantity}
              onChange={(e) =>
                setProduct((prev: any) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              type="number"
              required
              className="h-[40px]"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item required label="Giá" name="price">
            <div className="hidden">{product?.price}</div>
            <Input
              required
              type="number"
              className="h-[40px]"
              value={product?.price}
              onChange={(e) =>
                setProduct((prev: any) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item required label="Danh mục" name="category">
            <div className="hidden">
              {JSON.stringify(first(product?.subCategory))}
            </div>

            <Select
              className="h-[40px]"
              value={(product?.subCategory as any)?._id}
              onSelect={(value) => {
                const subCategory = allSubcategories.find(
                  (item: any) => item._id === value
                );

                const category = categories.find(
                  (item: any) => item._id === subCategory?.parentCategoryId
                );

                setProduct((prev: any) => ({
                  ...prev,
                  subCategory,
                  category,
                }));
              }}
            >
              {allSubcategories.map((item: any) => (
                <Option key={item?._id} value={item?._id}>
                  {item?.name.vi}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Nhãn hiệu" required name="branch">
            <div className="hidden">{product?.branch._id}</div>
            <Select
              value={product?.branch._id}
              defaultValue={product?.branch._id}
              className="h-[40px]"
            >
              {branches.map((item: any) => (
                <Option value={item?._id}>{item?.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <FormItem required label="Mô tả sản phẩm">
            <ReactQuill
              theme="snow"
              value={product?.description}
              onChange={(text) =>
                setProduct((prev: any) => ({ ...prev, description: text }))
              }
              style={{ height: "100px" }}
            />
          </FormItem>
        </Col>

        <Col span={24} style={{ marginTop: "50px" }}>
          <FormItem label="Ảnh 1">
            <Upload
              {...props1}
              onChange={(info) => {
                if (info.file?.response?.url) {
                  setImages((prev) => ({
                    ...prev,
                    0: info.file?.response?.url,
                  }));
                  setImgLoading(false);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Ảnh 2">
            <Upload
              {...props1}
              onChange={(info) => {
                if (info.file?.response?.url) {
                  setImages((prev) => ({
                    ...prev,
                    1: info.file?.response?.url,
                  }));
                  setImgLoading(false);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Ảnh 3">
            <Upload
              {...props1}
              onChange={(info) => {
                if (info.file?.response?.url) {
                  setImages((prev) => ({
                    ...prev,
                    2: info.file?.response?.url,
                  }));
                  setImgLoading(false);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Ảnh 4">
            <Upload
              {...props1}
              onChange={(info) => {
                if (info.file?.response?.url) {
                  setImages((prev) => ({
                    ...prev,
                    3: info.file?.response?.url,
                  }));
                  setImgLoading(false);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </FormItem>
        </Col>

        <Col className="flex gap-2">
          {[...Array(4)].map((__, index: number) => (
            <div
              className="w-[100px] h-[100px] object-cover border-cyan-900 border-2"
              key={(images as any)?.[index] || index}
            >
              {(images as any)?.[index] && (
                <img src={(images as any)?.[index]} alt="anh" />
              )}
            </div>
          ))}
        </Col>
        <Col span={24}>
          <div className="flex justify-end w-full">
            <Button
              disabled={loading || imgLoading}
              type="primary"
              className="bg-primary"
              htmlType="submit"
              loading={loading}
            >
              Cập nhật sản phẩm
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default EditProduct;
