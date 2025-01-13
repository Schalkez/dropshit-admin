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
import { flatMap } from "lodash";

const AddProduct = () => {
  const [value, setValue] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const { categories } = useCategories();
  const { branches } = useBranches();

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

    onChange: (info) => {
      if (info.file?.response?.url) {
        setImage([...image, info.file?.response?.url] as any);
        setImgLoading(false);
      }
    },
  };

  const onSubmit = (form: any) => {
    const subCategory = JSON.parse(form.category ?? {});

    setLoading(true);

    http
      .post(apiRoutes.products, {
        branch: form.branch,
        name: form.name,
        quantity: form.quantity,
        price: form.price,
        finalPrice: form.finalPrice,
        deliveryDays: form.deliveryDays,
        category: subCategory.parentCategoryId,
        subCategory: subCategory._id,
        images: image,
        description: value,
        user: admin?.user?._id,
        saleDefault: form.saleDefault,
      })
      .then((response) => {
        setLoading(false);
        message.success("Success");
        navigate("/products");
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };
  return (
    <Card
      title={
        <Link to={webRoutes.products}>
          <div className="flex items-center gap-2">
            <LeftOutlined />
            Thêm sản phẩm mới
          </div>
        </Link>
      }
    >
      <Form onFinish={onSubmit} disabled={loading}>
        <Row>
          <Col span={24}>
            <Form.Item required label="Tên sản phẩm" name={"name"}>
              <Input required className="h-[40px]" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item required label="Số lượng" name={"quantity"}>
              <Input
                defaultValue={4999}
                type="number"
                required
                className="h-[40px]"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              required
              label="Thời gian vận chuyển"
              name={"deliveryDays"}
            >
              <Input
                defaultValue={7}
                type="number"
                required
                className="h-[40px]"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Giá kho" name="price">
              <Input required type="number" className="h-[40px]" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Giá chốt" name="finalPrice">
              <Input required type="number" className="h-[40px]" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item required label="Thể loại" name="category">
              <Select className="h-[40px]">
                {allSubcategories.map((item: any) => (
                  <Option key={item?._id} value={JSON.stringify(item)}>
                    {item?.name.vi}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nhãn hiệu" required name="branch">
              <Select defaultValue={branches?.[0]?._id} className="h-[40px]">
                {branches.map((item: any) => (
                  <Option value={item?._id}>{item?.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Bán mặc định" name="saleDefault">
              <Input className="h-[40px]" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <FormItem required label="Mô tả sản phẩm">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                style={{ height: "100px" }}
              />
            </FormItem>
          </Col>

          <Col span={24} style={{ marginTop: "50px" }}>
            <FormItem label="Ảnh 1">
              <Upload {...props1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Ảnh 2">
              <Upload {...props1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Ảnh 3">
              <Upload {...props1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Ảnh 4">
              <Upload {...props1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </FormItem>
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
                Thêm sản phẩm
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AddProduct;
