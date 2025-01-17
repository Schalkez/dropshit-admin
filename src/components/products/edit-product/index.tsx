import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../../utils/http";
import { apiRoutes } from "../../../routes/api";
import { Option } from "antd/es/mentions";
import { UploadProps } from "antd/lib/upload";
import { handleErrorResponse } from "../../../utils";
import { RootState, store } from "../../../store";
import { useCategories } from "../../../hooks/useCategories";
import { useBranches } from "../../../hooks/useBranches";
import _, { first, flatMap } from "lodash";
import { useUsers } from "../../../hooks/useUsers";

const EditProduct = ({ editProduct, setIsEditModalOpen, reload }: any) => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [product, setProduct] = useState<any>();

  const { users } = useUsers();

  useEffect(() => {
    setProduct({
      ...editProduct,
      sellers: editProduct.sellers.map((seller: any) => seller._id) || [],
    });

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

  const onSubmit = () => {
    setLoading(true);

    http
      .patch(`${apiRoutes.products}/${product._id}`, {
        branch: product.branch,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        finalPrice: product.finalPrice,
        sellers: product.sellers,
        isProductFeature: product.isProductFeature,
        isBestSelling: product.isBestSelling,
        deliveryDays: product.deliveryDays,
        category: product.category._id,
        subCategory: product.subCategory._id,
        images: Object.values(images),
        description: product.description,
        user: admin?.user?._id,
        saleDefault: product.saleDefault,
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

  const onChange = (value: string) => {
    setProduct((prev: any) => ({ ...prev, sellers: value }));
  };

  const options = users?.map((user: any) => ({
    label: user.name,
    value: user._id,
  }));

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
        <Col span={24}>
          <Form.Item
            required
            label="Thời gian vận chuyển"
            name={"deliveryDays"}
          >
            <div className="hidden">{product?.deliveryDays}</div>
            <Input
              value={product?.deliveryDays}
              onChange={(e) =>
                setProduct((prev: any) => ({
                  ...prev,
                  deliveryDays: Number(e.target.value),
                }))
              }
              type="number"
              required
              className="h-[40px]"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 6 }}
            required
            label="Sản phẩm bán chạy"
            name={"isBestSelling"}
          >
            <div className="hidden">{product?.isBestSelling}</div>
            <Switch
              value={product?.isBestSelling}
              onChange={(bol) =>
                setProduct((prev: any) => ({
                  ...prev,
                  isBestSelling: bol,
                }))
              }
            />
          </Form.Item>
        </Col>
        <Row />
        <Col span={12}>
          <Form.Item
            required
            labelCol={{ span: 6 }}
            label="Sản phẩm nổi bật"
            name={"isProductFeature"}
          >
            <div className="hidden">{product?.isProductFeature}</div>
            <Switch
              value={product?.isProductFeature}
              onChange={(bol) =>
                setProduct((prev: any) => ({
                  ...prev,
                  isProductFeature: bol,
                }))
              }
            />
          </Form.Item>
        </Col>
        <Col span={24}>
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
          <Form.Item required label="Giá kho" name="price">
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
          <Form.Item required label="Giá chốt" name="finalPrice">
            <div className="hidden">{product?.finalPrice}</div>
            <Input
              required
              type="number"
              className="h-[40px]"
              value={product?.finalPrice}
              onChange={(e) =>
                setProduct((prev: any) => ({
                  ...prev,
                  finalPrice: Number(e.target.value),
                }))
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item required label="Shop" name="shop">
            <div className="hidden">{JSON.stringify(product?.sellers)}</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              value={product?.sellers}
              onChange={onChange}
              options={options}
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
          <Form.Item label="Bán mặc định" name="saleDefault">
            <div className="hidden">{product?.saleDefault}</div>
            <Input
              className="h-[40px]"
              value={product?.saleDefault}
              onChange={(e) =>
                setProduct((prev: any) => ({
                  ...prev,
                  saleDefault: e.target.value,
                }))
              }
            />
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
