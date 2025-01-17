import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Tag,
  Upload,
  message,
} from "antd";
import { webRoutes } from "../../routes/web";
import { Link } from "react-router-dom";
import BasePageContainer from "../layout/PageContainer";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import { API_URL, handleErrorResponse } from "../../utils";
import TextArea from "antd/es/input/TextArea";

const Withdraw = () => {
  const actionRef = useRef<ActionType>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const [open1, setOpenNote] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>();

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={webRoutes.category}>Dashboard</Link>,
      },
      {
        key: webRoutes.category,
        title: <Link to={webRoutes.users}>Rút tiền</Link>,
      },
    ],
  };

  const columns: ProColumns[] = [
    {
      title: "Ngân hàng",
      dataIndex: "bank",
      sorter: false,
      align: "left",
      ellipsis: true,
      render: (_: any, row: any) => (
        <>
          <div>Tên Chủ Thẻ : {row?.user?.bankInfo?.authorName}</div>
          <div>STK : {row?.user?.bankInfo?.numberBank}</div>
          <div>Ngân hàng: {row?.user?.bankInfo?.nameBank}</div>
        </>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "moneyPayment",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => <>{row?.moneyWithDraw?.toLocaleString()}</>,
    },
    {
      title: "ID Giao Dịch",
      dataIndex: "_id",
      sorter: false,
      align: "center",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "isResolve",
      sorter: false,
      align: "center",
      ellipsis: true,
    },
    {
      title: "Ngày rút",
      dataIndex: "createdAt",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => new Date(row?.createdAt)?.toLocaleString(),
    },
    {
      title: "Action",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => (
        <>
          {row?.isResolve === "RESOLVE" ? (
            <Tag color="success">Đã giải quyết</Tag>
          ) : row?.isResolve === "REJECT" ? (
            <Tag color="red">Đã Hủy</Tag>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                loading={loading}
                type="primary"
                className="bg-success"
                onClick={() => {
                  setSelectedRow(row);
                  setInputModalOpen(true);
                }}
              >
                Giải quyết
              </Button>
              <Button
                loading={loading}
                type="primary"
                className="bg-warning"
                onClick={() => {
                  setOpenNote(true);
                  setSelectedRow(row);
                }}
              >
                Hủy
              </Button>
            </div>
          )}
        </>
      ),
    },
  ];

  const props: UploadProps = {
    name: "file",
    action: `${import.meta.env.VITE_API_URL}/upload/file`,
    beforeUpload: (file) => {
      const isPNG = file.type === "image/png" || "image/jpeg";
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
        message.success("Success");
        setIsOpen(false);
        console.log(response);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  const onResolve = async (
    id: string,
    isResolve: boolean,
    customMoney?: number,
    note?: string
  ) => {
    http
      .post(`${API_URL}/admin/resolve-with-draw`, {
        id,
        isResolve,
        customMoney,
        note,
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false);
        message.success("Success");
        setIsOpen(false);
        setOpenNote(false);
        setSelectedRow(undefined);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Spin fullscreen spinning={loading} />
      {!!selectedRow && (
        <Modal
          centered
          footer={null}
          open={open1}
          onCancel={() => {
            setOpenNote(false);
            setSelectedRow(undefined);
          }}
          width={400}
        >
          <Form
            onFinish={(form: any) =>
              onResolve(selectedRow._id, false, undefined, form?.note)
            }
          >
            <div className="mb-2">Lý do từ chối </div>
            <Form.Item name="note">
              <TextArea placeholder="Ghi chú" />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button htmlType="submit">Từ chối</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {!!selectedRow && (
        <Modal
          centered
          footer={null}
          open={inputModalOpen}
          onCancel={() => {
            setInputModalOpen(false);
            setSelectedRow(undefined);
          }}
          width={400}
        >
          <Form
            onFinish={async (form: any) =>
              await onResolve(
                selectedRow._id,
                true,
                form.moneyWithDraw || selectedRow.moneyWithDraw,
                form?.note
              )
            }
          >
            <div className="mb-2">Trừ tiền ví shop</div>
            <Form.Item
              name="moneyWithDraw"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền!" },
                () => ({
                  validator(_, value) {
                    if (value === undefined || value === null || value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Giá trị phải lớn hơn 0!"));
                  },
                }),
              ]}
            >
              <Input
                type="number"
                name="moneyWithDraw"
                value={selectedRow?.moneyWithDraw}
                defaultValue={selectedRow?.moneyWithDraw}
                addonBefore="$"
              />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button htmlType="submit">Trừ ví shop</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* <Modal
        centered
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item label="Tên ngân hàng" name={"name"}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Số tài khoản" name={"number"}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Chủ thẻ" name={"author"}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item label="Mô tả" name={"des"}>
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
      </Modal> */}
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
        actionRef={actionRef}
        request={(params) => {
          return http
            .get(`${API_URL}/admin/with-draws`, {
              params: {
                page: params.current,
                limit: params.pageSize,
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

export default Withdraw;
