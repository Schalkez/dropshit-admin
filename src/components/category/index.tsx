import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  Modal,
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
import { handleErrorResponse } from '../../utils';
const Catgoery = () => {
  const actionRef = useRef<ActionType>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState('');
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
  const columns: ProColumns[] = [
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      sorter: false,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
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
          <img src={row?.img} className='w-[70px]' />
        </div>
      )
    },
    {
      title: 'Action',
      sorter: false,
      align: 'center',
      ellipsis: true,
      render: (_: any, row: any) => (
        <div>
          <Button loading={loading} type='primary' className='bg-primary' onClick={() => onDelete(row._id)}>Xóa</Button>
        </div>
      )
    }
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
    setLoading(true)
    http
      .post(apiRoutes.category, {
        ...form,
        img,
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false)
        message.success("Success")
        setIsOpen(false)
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false)
      });
  };

  const onDelete = async (id: string) => {
    http
      .post(apiRoutes.category + '-delete', {
        id
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false)
        message.success("Success")
        setIsOpen(false)
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false)
      });
  }
  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div className="flex justify-end items-center">
        <Button
          type="primary"
          className="bg-primary"
          onClick={() => setIsOpen(true)}
        >
          Thêm Category
        </Button>
      </div>
      <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item label="Tên thể loại" name={'name'}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Ảnh biểu tượng" >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="bg-primary" htmlType='submit' loading={loading} disabled={loading}>
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
            .get(apiRoutes.category, {
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
              } as any
            })
            .catch((error) => {
            });
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

export default Catgoery;
