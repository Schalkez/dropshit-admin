import { Button, Card, Col, Form, Input, Row, Select, Upload, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { UploadOutlined, LeftOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../../routes/web';
import http from '../../../utils/http';
import { apiRoutes } from '../../../routes/api';
import { Option } from 'antd/es/mentions';
import { UploadProps } from 'antd/lib/upload';
import { handleErrorResponse } from '../../../utils';
import { RootState, store } from '../../../store';
import categories from "../../../assets/data/categories.json"
const AddProduct = () => {
  const [value, setValue] = useState('');
  const [dataBranch, setDataBranch] = useState([]);
  const [dataCategory, setCategory] = useState<string[]>([]);
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(false)
  const allSubcategories = categories.flatMap((category) =>
    category.subcategories?.map((sub: any) => ({
      name: sub.name || sub.subcategory,
      slug: sub.slug || sub.url,
    })) || []
  );

  const state: RootState = store.getState();
  const admin = state.admin as any
  const navigate = useNavigate()
  const getData = async () => {
    http
      .get(apiRoutes.category)
      .then((response) => {
        setCategory(response.data.data);
      })
      .catch((error) => { });
    http
      .get(apiRoutes.branch)
      .then((response) => {
        setDataBranch(response.data.data);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    getData();
  }, []);


  const props1: UploadProps = {
    name: 'file',
    action: `${import.meta.env.VITE_API_URL}/upload/file`,
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png' || 'image/jpeg';
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },

    onChange: (info) => {
      if (info.file?.response?.url) setImage([...image, info.file?.response?.url] as any);
    },
  };

  const onSubmit = (form: any) => {
    console.log(form, image);
    setLoading(true)
    http
      .post(apiRoutes.product, {
        ...form,
        images: image,
        description: value,
        user: admin?.user?._id
      })
      .then((response) => {
        setLoading(false)
        message.success("Success")
        console.log(response);
        navigate('/products')
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false)
      });
  }
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
      <Form onFinish={onSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item label="Tên sản phẩm" name={'name'}>
              <Input className="h-[40px]" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Số lượng" name={'quantity'}>
              <Input className="h-[40px]" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giá" name='price'>
              <Input className="h-[40px]" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thể loại" name='category'>
              <Select className="h-[40px]">
                {allSubcategories.map((item: any, index: number) => (
                  <Option key='index' value={item?.slug}>{item?.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nhãn hiệu" name='branch'>
              <Select className="h-[40px]">
                {dataBranch.map((item: any, index: number) => (
                  <Option value={item?._id}>{item?.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <FormItem label="Mô tả sản phẩm">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                style={{ height: '100px' }}
              />
            </FormItem>
          </Col>

          <Col span={24} style={{ marginTop: '50px' }}>
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
              <Button type="primary" className="bg-primary" htmlType='submit' loading={loading}>
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
