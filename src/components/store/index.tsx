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
  Modal,
  Space,
  Spin,
  Switch,
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
  PROFILE = "PROFILE",
  EDIT = "EDIT",
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
  const [selectUser, setSelectUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState<any>();
  const [form] = Form.useForm();
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
          <div className="flex items-center gap-2">
            <div className="font-[700]">ID:</div>
            <div>{row?._id}</div>
          </div>
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
            <div className="font-[700]">Code đã nhập:</div>
            <div>{row?.parentCode}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-[700]">Mật khẩu:</div>
            <div>{row?.password || ""}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-[700]">Số dư:</div>
            <div>{row?.money?.toLocaleString()}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Xác nhận  ",
      align: "center",
      key: "option",
      fixed: "right",
      render: (_, row: any) => (
        <Switch
          onChange={(value) => verifyShop(value, row?._id)}
          defaultChecked={row?.store?.isVerify === "SUCCESS"}
          className={"!bg-primary"}
        />
      ),
    },
    {
      title: "Cửa hàng",
      dataIndex: "store",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_, row: any) =>
        row?.store ? (
          <div className="flex flex-col gap-1">
            <div className="my-2 rounded-full w-20 h-20 overflow-hidden">
              <img src={row?.store?.logoStore} className="w-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">Tên cửa hàng:</div>
              <div>{row?.store?.nameStore}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">Địa chỉ:</div>
              <div>{row?.store?.address}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">Email:</div>
              <div>{row?.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">Phone:</div>
              <div>{row?.phone}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">CMND mặt trước:</div>
              <a href={row?.store?.cmnd?.before} target="_blank">
                <img src={row?.store?.cmnd?.before} width={50} />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">CMND mặt trước:</div>
              <a href={row?.store?.cmnd?.after} target="_blank">
                <img src={row?.store?.cmnd?.after} width={50} />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-[700]">Trạng thái :</div>
              <div>
                {row?.store?.isVerify === "PENDING" ? (
                  <Tag color="warning">Đang chờ</Tag>
                ) : (
                  <Tag color="success">Đã xác nhận</Tag>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>Chưa tạo cửa hàng</div>
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
          {/* {row?.roles[0]?.code === 'SELLER' && row?.store && (
            <div className="cursor-pointer">
              <u>Xem thông tin shop</u>
            </div>
          )} */}
        </div>
      ),
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
              key: ActionKey.PROFILE,
              name: (
                <Space>
                  <FiUsers />
                  Hồ sơ
                </Space>
              ),
            },
            {
              key: ActionKey.EDIT,
              name: (
                <Space>
                  <FiUsers />
                  Chỉnh sửa
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
    if (key === ActionKey.PROFILE) {
      getProfileUser(user?._id);
    }
    if (key === ActionKey.EDIT) {
      setIsEdit(user);
    }
  };
  const getProfileUser = (id: any) => {
    setLoading(true);
    http
      .get(`${API_URL}/admin/getUserProfile/${id}`)
      .then((response) => {
        setSelectUser(response?.data?.data);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
    setLoading(false);
  };
  const showDeleteConfirmation = (user: any) => {
    modal.confirm({
      title: "Are you sure to delete this shop?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <ProDescriptions column={1} title=" ">
          <ProDescriptions.Item valueType="text" label="Số điện thoại">
            {user?.phone}
          </ProDescriptions.Item>
          <ProDescriptions.Item valueType="text" label="Email">
            {user?.email}
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
  const verifyShop = (isVerify: boolean, id: string) => {
    http
      .post(`${API_URL}/admin/verifyShop`, {
        isVerify,
        id,
      })
      .then(() => {
        actionRef.current?.reloadAndRest?.();
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };
  const updateProfileUser = (form: any) => {
    http
      .post(`${API_URL}/admin/updateProfileUser`, {
        ...form,
      })
      .then(() => {
        showNotification(
          "Success",
          NotificationType.SUCCESS,
          "User update success."
        );

        actionRef.current?.reloadAndRest?.();
        location.reload();
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Spin fullscreen spinning={loading} />
      <Modal
        centered
        footer={null}
        onCancel={() => {
          setIsEdit(null);
          form.resetFields();
        }}
        open={isEdit}
      >
        <Form
          initialValues={{ ...isEdit, ...isEdit?.bankInfo, ...isEdit?.store }}
          form={form}
          onFinish={(form: any) =>
            updateProfileUser({
              id: isEdit?._id,
              ...form,
              views: form?.views || 0,
            })
          }
        >
          <Form.Item name={"email"} label="Email">
            <Input placeholder="Email" size="middle" />
          </Form.Item>
          <Form.Item name={"password"} label="Password">
            <Input placeholder="password" size="middle" />
          </Form.Item>
          <Form.Item name={"views"} label="Lượt xem">
            <Input placeholder="Lượt xem" size="middle" />
          </Form.Item>
          <Form.Item name={"stars"} label="Đánh giá">
            <Input placeholder="Đánh giá" size="middle" />
          </Form.Item>
          <Form.Item name={"nameBank"} label="Tên Ngân Hàng">
            <Input placeholder="Tên Ngân Hàng" size="middle" />
          </Form.Item>
          <Form.Item name={"numberBank"} label="Số tài khoản">
            <Input placeholder="Số tài khoản" size="middle" />
          </Form.Item>
          <Form.Item name={"authorName"} label="Tên chủ thẻ">
            <Input placeholder="Tên chủ thẻ" size="middle" />
          </Form.Item>
          <Form.Item name={"money"} label="Số dư ví">
            <Input placeholder="Số dư ví" size="middle" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="!bg-primary">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        centered
        footer={null}
        onCancel={() => setSelectUser(null)}
        open={selectUser}
      >
        <div className="modal-body">
          <div className="text-center">
            <span className="avatar avatar-xxl mb-3">
              <img src="https://ebays-vn.com/public/assets/img/placeholder.jpg" />
            </span>
            <h1 className="h5 mb-1">{selectUser?.user?.name}</h1>
            <p className="text-sm text-muted">{selectUser?.user?.phone}</p>
          </div>
          <hr />
          <br />
          <h6 className="mb-4">Thông tin thanh toán</h6>
          <p>Tên ngân hàng : {selectUser?.user?.bankInfo?.nameBank}</p>
          <p>
            Tên tài khoản ngân hàng : {selectUser?.user?.bankInfo?.authorName}
          </p>
          <p>
            Số tài khoản ngân hàng : {selectUser?.user?.bankInfo?.numberBank}
          </p>
          <p>Chi nhánh : {selectUser?.user?.bankInfo?.branchBank}</p>
          <br />
          <div className="table-responsive">
            <table className="table table-striped mar-no">
              <tbody>
                <tr>
                  <td>Tổng số sản phẩm</td>
                  <td>{selectUser?.countProduct || 0}</td>
                </tr>
                <tr>
                  <td>Tổng số đơn đặt hàng</td>
                  <td>{selectUser?.countOrder || 0}</td>
                </tr>
                <tr>
                  <td>Tổng số tiền nạp</td>
                  <td>${selectUser?.totalPayment}</td>
                </tr>
                <tr>
                  <td>Tổng số tiền rút</td>
                  <td>${selectUser?.totalWithdraw}</td>
                </tr>
                <tr>
                  <td>Số dư ví</td>
                  <td>${selectUser?.user?.money}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
          console.log(params);

          return http
            .get(apiRoutes.users, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                role: "SELLER",
                search: params?.keyword,
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
        options={{
          search: true,
        }}
        rowKey="id"
      />
      {modalContextHolder}
    </BasePageContainer>
  );
};

export default Users;
