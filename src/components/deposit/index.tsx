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
import { Ref, useRef, useState } from "react";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import { API_URL, handleErrorResponse } from "../../utils";
import TextArea from "antd/es/input/TextArea";
import { debounce } from "lodash";
import { set } from "nprogress";

const Deposit = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<HTMLFormElement>(null);
  const [modal, setModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const [openNote, setOpenNote] = useState<boolean>(false);

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={webRoutes.category}>Dashboard</Link>,
      },
      {
        key: webRoutes.category,
        title: <Link to={webRoutes.users}>Nạp tiền</Link>,
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
      render: (_: any, row: any) => {
        return (
          <>
            <div>Tên Chủ Thẻ : {row?.user?.bankInfo?.authorName}</div>
            <div>STK : {row?.user?.bankInfo?.numberBank}</div>
            <div>Ngân hàng: {row?.user?.bankInfo?.nameBank}</div>
          </>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "moneyPayment",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => <>{row?.moneyPayment?.toLocaleString()}</>,
    },
    {
      title: "ID Giao Dịch",
      dataIndex: "content",
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
      title: "Ngày nạp",
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
      render: (_: any, row: any) => {
        return (
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
                    // debounce(() => setModal(true), 200)();
                    setModal(true);
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
        );
      },
    },
  ];
  console.log(selectedRow);
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

  const onResolve = async (
    id: string,
    isResolve: boolean,
    moneyPayment: number,
    note?: string
  ) => {
    http
      .post(`${API_URL}/admin/resolve-payment`, {
        id,
        isResolve,
        moneyPayment,
        note,
      })
      .then((response) => {
        actionRef.current?.reloadAndRest?.();
        setLoading(false);
        message.success("Success");
        setModal(false);
        setSelectedRow(undefined);
        setOpenNote(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Spin fullscreen spinning={loading} />

      {selectedRow && modal && (
        <Modal
          centered
          open={modal}
          onCancel={() => {
            setModal(false);
            setSelectedRow(undefined);
            formRef.current?.reset();
          }}
          width={400}
          footer={null}
        >
          <form
            ref={formRef}
            className="mt-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);
              const moneyPayment = formData.get("moneyPayment") as string;
              onResolve(selectedRow._id, true, Number(moneyPayment));
            }}
          >
            <Form.Item name="Cộng ví giao hàng">
              <Input
                defaultValue={selectedRow.moneyPayment}
                placeholder={selectedRow.moneyPayment}
                name="moneyPayment"
                type="number"
                addonBefore="$"
              />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button htmlType="submit">Cộng ví giao hàng</Button>
            </Form.Item>
          </form>
        </Modal>
      )}

      {openNote && selectedRow && (
        <Modal
          centered
          open={openNote}
          onCancel={() => {
            setOpenNote(false);
          }}
          width={400}
          footer={null}
        >
          <form
            ref={formRef}
            className="mt-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);
              const note = formData.get("note") as string;
              onResolve(selectedRow._id, false, 0, note);
            }}
          >
            <Form.Item label="Lý do từ chối" name="Lý do từ chối">
              <Input placeholder="từ chối" name="note" />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button htmlType="submit">Ok</Button>
            </Form.Item>
          </form>
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
            .get(`${API_URL}/admin/payments`, {
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

export default Deposit;
