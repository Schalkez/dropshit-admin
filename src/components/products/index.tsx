import { BreadcrumbProps, Button, message, Modal } from "antd";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { webRoutes } from "../../routes/web";
import BasePageContainer from "../layout/PageContainer";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { handleErrorResponse } from "../../utils";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditProduct from "./edit-product";

const Products = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState();

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={"#"}>Dashboard</Link>,
      },
      {
        key: webRoutes.products,
        title: <Link to={webRoutes.products}>Products</Link>,
      },
    ],
  };

  const columns: ProColumns[] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => (
        <div
          className="text-truncate"
          style={{
            maxWidth: "200px",
          }}
        >
          {row?.name}
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => (
        <div>
          <img src={row?.images?.[0]} className="w-[70px]" />
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: false,
      align: "center",
      ellipsis: true,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (price: any, row: any) => (
        <div>{row?.price?.toLocaleString()}$</div>
      ),
    },
    {
      title: "Action",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_: any, row: any) => (
        <div className="flex gap-8 justify-center">
          <EditOutlined
            style={{ fontSize: "20px" }}
            onClick={() => {
              setIsEditModalOpen(true);
              setEditProduct(row);
            }}
          />
          <DeleteOutlined
            style={{ fontSize: "20px" }}
            onClick={() => onDelete(row._id)}
          />
        </div>
      ),
    },
  ];

  const onDelete = async (id: string) => {
    setLoading(true);
    http
      .delete(`${apiRoutes.product}/${id}`)
      .then((response) => {
        setLoading(false);
        message.success("Success");
        actionRef?.current?.reload();
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Modal
        width={"90%"}
        open={editModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditProduct(undefined);
        }}
      >
        <EditProduct
          setIsEditModalOpen={setIsEditModalOpen}
          reload={actionRef?.current?.reload}
          editProduct={editProduct}
        />
      </Modal>

      <div className="flex justify-between items-center">
        <h3>Tất cả sản phẩm</h3>
        <Link to={webRoutes.add_products}>
          <Button type="primary" className="bg-[#818cf8]">
            Thêm sản phẩm mới
          </Button>
        </Link>
      </div>
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
            .get(apiRoutes.products, {
              params: {
                page: params.current,
                per_page: params.pageSize,
                role: "ADMIN",
              },
            })
            .then((response) => {
              return {
                data: response.data.data,
                total: response.data.total,
                success: true,
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

export default Products;
