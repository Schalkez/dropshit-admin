import {
  ActionType,
  ProTable,
  ProColumns,
  RequestData,
  TableDropdown,
  ProDescriptions,
} from "@ant-design/pro-components";
import {
  BreadcrumbProps,
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Tag,
} from "antd";
import { useRef, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { CiCircleMore } from "react-icons/ci";
import { Link } from "react-router-dom";
import { User } from "../../interfaces/models/user";
import { apiRoutes } from "../../routes/api";
import { webRoutes } from "../../routes/web";
import {
  API_URL,
  handleErrorResponse,
  NotificationType,
  showNotification,
} from "../../utils";
import http from "../../utils/http";
import BasePageContainer from "../layout/PageContainer";
import LazyImage from "../lazy-image";
import Icon, {
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

enum ActionKey {
  DELETE = "delete",
}

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={"#"}>Dashboard</Link>,
    },
    {
      key: webRoutes.users,
      title: <Link to={webRoutes.users}>Users</Link>,
    },
  ],
};

const Users = () => {
  const actionRef = useRef<ActionType>();
  const [modal, modalContextHolder] = Modal.useModal();
  const [isOpen, setIsOpen] = useState(false);
  const columns: ProColumns[] = [
    // {
    //   title: 'Avatar',
    //   dataIndex: 'avatar',
    //   align: 'center',
    //   sorter: false,
    //   render: (_, row: User) =>
    //     row.avatar ? (
    //       <Avatar
    //         shape="circle"
    //         size="small"
    //         src={
    //           <LazyImage
    //             src={row.avatar}
    //             placeholder={<div className="bg-gray-100 h-full w-full" />}
    //           />
    //         }
    //       />
    //     ) : (
    //       <Avatar shape="circle" size="small">
    //         {row.first_name.charAt(0).toUpperCase()}
    //       </Avatar>
    //     ),
    // },
    {
      title: "Thông tin",
      dataIndex: "name",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_, row: any) => (
        <div className="flex flex-col gap-1">
          {row?.isCustomerVirtual && (
            <div className="flex  justify-center items-center">
              <Tag color="orange">Virtual</Tag>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="font-[700]">Email:</div>
            <div>{row?.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-[700]">Phone:</div>
            <div>{row?.phone}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-[700]">Password:</div>
            <div>{row?.password || "-"}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-[700]">Số dư:</div>
            <div>{row?.money?.toLocaleString()}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "roles",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_, row: any) => (
        <div className="flex flex-col gap-1">
          <div>
            <Tag color="orange">{row?.roles[0]?.code}</Tag>
          </div>
          {row?.roles[0]?.code === "STORE" && (
            <div className="cursor-pointer">
              <u>Xem thông tin shop</u>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ngày mở",
      dataIndex: "store",
      sorter: false,
      align: "center",
      render: (_, row: any) => row?.createdAt?.toLocaleString(),
    },
    {
      title: "Action",
      align: "center",
      key: "option",
      fixed: "right",
      render: (_, row: User) => [
        <TableDropdown
          key="actionGroup"
          onSelect={(key) => handleActionOnSelect(key, row)}
          menus={[
            {
              key: ActionKey.DELETE,
              name: (
                <Space>
                  <DeleteOutlined />
                  Delete
                </Space>
              ),
            },
          ]}
        >
          <Icon component={CiCircleMore} className="text-primary text-xl" />
        </TableDropdown>,
      ],
    },
  ];

  const handleActionOnSelect = (key: string, user: User) => {
    if (key === ActionKey.DELETE) {
      showDeleteConfirmation(user);
    }
  };

  const showDeleteConfirmation = (user: any) => {
    modal.confirm({
      title: "Are you sure to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <ProDescriptions column={1} title=" ">
          <ProDescriptions.Item valueType="text" label="Số điện thoại">
            {user?.phone}
          </ProDescriptions.Item>
          <ProDescriptions.Item valueType="text" label="Email">
            {user.email}
          </ProDescriptions.Item>
        </ProDescriptions>
      ),
      okButtonProps: {
        className: "bg-primary",
      },
      onOk: () => {
        return http
          .delete(`${API_URL}/admin/user/${user?._id}`)
          .then(() => {
            showNotification(
              "Success",
              NotificationType.SUCCESS,
              "User is deleted."
            );

            actionRef.current?.reloadAndRest?.();
          })
          .catch((error) => {
            handleErrorResponse(error);
          });
      },
    });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div className="my-5">
        <Button onClick={() => setIsOpen(true)}>Thêm khách ảo</Button>
      </div>
      <Modal open={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
        <Form
          layout="vertical"
          onFinish={async (form: any) => {
            if (!form?.name || !form?.phone || !form?.email || !form?.address)
              return message.error("Vui lòng nhập đầy đủ thông tin");

            try {
              const res = await http.post(`${API_URL}/profile/add-virtual`, {
                ...form,
              });
              if (res && res.data) {
                setIsOpen(false);
                message.success("Đã thêm 1 khách hàng ảo");
                actionRef?.current?.reload();
              }
            } catch (error) {
              message.error("Có lỗi xảy ra");
              console.log(error);
            }
          }}
        >
          <Form.Item label="Tên" name={"name"}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name={"address"}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name={"email"}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name={"phone"}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" className="bg-[#000]">
              {" "}
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ProTable
        columns={columns}
        cardBordered={false}
        cardProps={{
          subTitle: "Users",
          tooltip: {
            className: "opacity-60",
            title: "Mocked data",
          },
          title: <FiUsers className="opacity-60" />,
        }}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={"fixed"}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        actionRef={actionRef}
        request={(params) => {
          return http
            .get(apiRoutes.users, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                role: "CUSTOMER",
              },
            })
            .then((response) => {
              const users: [User] = response.data.data;
              console.log(response.data.data);

              return {
                data: users,
                success: true,
                total: response.data.total,
              } as RequestData<User>;
            })
            .catch((error) => {
              handleErrorResponse(error);

              return {
                data: [],
                success: false,
              } as RequestData<User>;
            });
        }}
        dateFormatter="string"
        search={false}
        rowKey="id"
        options={{
          search: false,
        }}
      />
      {modalContextHolder}
    </BasePageContainer>
  );
};

export default Users;
