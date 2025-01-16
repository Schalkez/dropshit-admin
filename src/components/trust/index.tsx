import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  BreadcrumbProps,
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { webRoutes } from "../../routes/web";
import { API_URL, handleErrorResponse } from "../../utils";
import http from "../../utils/http";
import BasePageContainer from "../layout/PageContainer";

type options = {
  label: string;
  value: string;
};

const Trust = () => {
  const actionRef = useRef<ActionType>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<options[]>([]);
  const [data, setData] = useState<any[]>([]);
  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={webRoutes.category}>Dashboard</Link>,
      },
      {
        key: webRoutes.trust,
        title: <Link to={webRoutes.trust}>Điểm tín nhiệm</Link>,
      },
    ],
  };
  const columns: ProColumns[] = [
    {
      title: "Số thứ tự",
      dataIndex: "_id",
      sorter: false,
      align: "left",
      ellipsis: true,
      render: (_: any, row: any, index: number) => (
        <div>
          <span>{index + 1}</span>
        </div>
      ),
    },
    {
      title: "Tên người bán",
      dataIndex: "userId.name",
      sorter: false,
      align: "left",
      ellipsis: true,
      render: (_: any, row: any) => (
        <div>
          <span>{row.userId.name}</span>
        </div>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "point",
      sorter: false,
      align: "center",
      ellipsis: true,
    },
    {
      title: "Action",
      sorter: false,
      align: "center",
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

  const getSellers = async () => {
    http
      .get(`${API_URL}/admin/users?page=1&limit=100000&role=SELLER`)
      .then((response) => {
        setSellers(
          response.data.data.map((item: any) => {
            return {
              label: item.name,
              value: item._id,
            };
          })
        );
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  const getSetting = async () => {
    http
      .get(`${API_URL}/admin/setting`, {
        params: {
          type: "TRUST",
        },
      })
      .then((response) => {
        setData(response.data);
        return {
          data: response.data.data,
          success: true,
          total: response.data.total || 30,
        } as any;
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getSellers();
    getSetting();
  }, []);

  const onSubmit = async (form: any) => {
    setLoading(true);
    http
      .post(`${API_URL}/admin/setting`, {
        ...form,
        type: "TRUST",
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false);
        message.success("Success");
        setIsOpen(false);
        getSetting();
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  const onDelete = async (id: string) => {
    http
      .delete(`${API_URL}/admin/setting/` + id)
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false);
        message.success("Success");
        setIsOpen(false);
        getSetting();
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
          Thêm Điểm tín nhiệm
        </Button>
      </div>
      <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item name="userId">
            <Select placeholder="Chọn người bán">
              {sellers.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="point" style={{ width: "100%" }}>
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
        tableLayout={"fixed"}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 30,
        }}
        dataSource={data}
        actionRef={actionRef}
        dateFormatter="string"
        search={false}
        rowKey="_id"
        options={{
          search: false,
        }}
      />
    </BasePageContainer>
  );
};

export default Trust;
