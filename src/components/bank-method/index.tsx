import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  Modal,
  Tag,
  Upload,
  message,
} from 'antd';
import { webRoutes } from '../../routes/web';
import { Link } from 'react-router-dom';
import BasePageContainer from '../layout/PageContainer';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { UploadOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib/upload';
import { API_URL, handleErrorResponse } from '../../utils';
import TextArea from 'antd/es/input/TextArea';
const BankMethod = () => {
  const actionRef = useRef<ActionType>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState('');

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={webRoutes.category}>Dashboard</Link>,
      },
      {
        key: webRoutes.category,
        title: <Link to={webRoutes.users}>Phương thức thanh toán</Link>,
      },
    ],
  };
  const columns: ProColumns[] = [
    {
      title: 'Tên ngân hàng',
      dataIndex: 'name',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'STK',
      dataIndex: 'number',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Chủ thẻ',
      dataIndex: 'author',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Biểu tượng',
      dataIndex: 'img',
      sorter: false,
      align: 'center',
      ellipsis: true,
      render: (_: any, row: any) => (
        <div>
          <img src={row?.img} className="w-[70px]" />
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'des',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Action',
      sorter: false,
      align: 'center',
      ellipsis: true,
      render: (_: any, row: any) => (
        <div>
          <Button
            loading={loading}
            type="primary"
            className="bg-primary"
            onClick={() => onDelete(row._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const props: UploadProps = {
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
      if (info.file?.response?.url) setImg(info.file?.response?.url);
    },
  };
  const onSubmit = async (form: any) => {
    setLoading(true);
    http
      .post(`${API_URL}/admin/addBankMethod`, {
        ...form,
        img,
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false);
        message.success('Success');
        setIsOpen(false);
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  const onDelete = async (id: string) => {
    http
      .post(`${API_URL}/admin/deleteMethodBank/${id}`)
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false);
        message.success('Success');
        setIsOpen(false);
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };
  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div className="flex justify-end items-center">
        <Button
          type="primary"
          className="bg-primary"
          onClick={() => setIsOpen(true)}
        >
          Thêm Phương Thức
        </Button>
      </div>
      <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item label="Tên ngân hàng" name={'name'}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Số tài khoản" name={'number'}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Chủ thẻ" name={'author'}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Mô tả" name={'des'}>
            <TextArea className="h-[40px]" rows={4} />
          </Form.Item>
          <Form.Item label="Ảnh biểu tượng">
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="bg-primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ProTable
        columns={columns}
        cardBordered={false}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={'fixed'}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 30,
        }}
        actionRef={actionRef}
        request={(params) => {
          return http
            .get(`${API_URL}/admin/getBankMethod`, {})
            .then((response) => {
              return {
                data: response.data.data,
                success: true,
                total: response.data.total || 30,
              } as any;
            })
            .catch((error) => {});
        }}
        dateFormatter="string"
        search={false}
        rowKey="id"
        options={{
          search: false,
        }}
      />
    </BasePageContainer>
  );
};

export default BankMethod;
