import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
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
import { Option } from 'antd/es/mentions';
const Config = () => {
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
        title: <Link to={webRoutes.users}>Setting</Link>,
      },
    ],
  };
  const columns: ProColumns[] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
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

  const onSubmit = async (form: any) => {
    setLoading(true);
    http
      .post(`${API_URL}/admin/setConfig`, {
        ...form,
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
      .post(`${API_URL}/admin/deleteConfig/`+id)
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
          Thêm Config
        </Button>
      </div>
      <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item name="name">
            <Select placeholder="Chọn config">
              <Option value="PROFIT">Hoa Hồng</Option>
            </Select>
          </Form.Item>
          <Form.Item name="value" style={{width:"100%"}}>
            <InputNumber placeholder="Nhập giá trị" />
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
            .get(`${API_URL}/admin/getConfig`, {
              params: {
                page: params.current,
                per_page: params.pageSize,
              },
            })
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

export default Config;
