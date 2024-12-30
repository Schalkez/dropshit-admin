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
  Checkbox,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import { useRef, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { CiCircleMore, CiUser } from "react-icons/ci";
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
import { sidebar } from "../layout/sidebar";
import { GetProp } from "antd/lib";

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
  const [loading, setLoading] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [userPermision, setUserPermision] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [keys, setKeys] = useState<any>([]);

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
    setKeys(checkedValues);
  };
  const columns: ProColumns[] = [
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
            <div>{row?.password}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-[700]">Code:</div>
            <div>{row?.code}</div>
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
      title: "Chức năng khoá",
      dataIndex: "store",
      sorter: false,
      align: "center",
      render: (_, row: any) => row?.keys?.join(","),
    },
    {
      title: "Ngày mở",
      dataIndex: "store",
      sorter: false,
      align: "center",
      render: (_, row: any) => new Date(row?.createdAt)?.toLocaleString(),
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
            {
              key: "PERMISION",
              name: (
                <Space>
                  <CiUser />
                  Phân Quyền
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

  const handleActionOnSelect = (key: string, user: any) => {
    if (key === ActionKey.DELETE) {
      showDeleteConfirmation(user);
    }
    if (key === "PERMISION") {
      setUserPermision(user);
    }
  };
  const updatePernmision = () => {
    setLoading(true);
    http
      .post(`${API_URL}/admin/updateEmploy`, {
        id: userPermision?._id,
        keys,
      })
      .then(() => {
        setLoading(false);
        showNotification(
          "Success",
          NotificationType.SUCCESS,
          "User is updated."
        );

        actionRef.current?.reloadAndRest?.();
      })
      .catch((error: any) => {
        setLoading(false);
        message.error(error?.response?.data?.message);
      });
  };
  const showDeleteConfirmation = (user: any) => {
    modal.confirm({
      title: "Are you sure to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <ProDescriptions column={1} title=" ">
          <ProDescriptions.Item valueType="text" label="Số Điện Thoại">
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
  const options = sidebar.map((item) => ({
    label: item.name, // Use 'name' instead of 'key' if you want to display the name in the checkbox label
    value: item.key,
  }));
  const onSubmitUser = async (form: any) => {
    setLoading(true);
    http
      .post(apiRoutes.addEmployee, {
        ...form,
        roleCode: "EMPLOYEE",
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

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Spin fullscreen spinning={loading} />
      <Button
        type="primary"
        className="bg-primary"
        onClick={() => setIsOpen(true)}
      >
        Thêm
      </Button>
      {userPermision && (
        <Modal
          centered
          open={userPermision}
          onCancel={() => setUserPermision(false)}
          footer={null}
        >
          <div className="mb-4">Chọn quyền User không được sử dụng</div>

          <Checkbox.Group
            options={options}
            onChange={onChange}
            defaultValue={userPermision?.keys}
          />

          <Button className="my-3" onClick={updatePernmision}>
            Xác nhận
          </Button>
        </Modal>
      )}

      <Modal
        centered
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onSubmitUser}>
          <Form.Item name={"name"} label="Tên">
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item name={"phone"} label="Số điện thoại">
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item name={"email"} label="Email">
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item name={"password"} label={"Mật khẩu"}>
            <Input className="h-[40px]" />
          </Form.Item>
          <Form.Item name={"password"}>
            <Button
              htmlType="submit"
              type="primary"
              className="bg-primary"
              loading={loading}
            >
              Submit
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
                role: "EMPLOYEE",
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
