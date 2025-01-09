import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../utils/http";
import { API_URL } from "../../utils";
import { Pagination, Select, Spin } from "antd";
import Search from "antd/es/input/Search";
import { SearchProps } from "antd/lib/input";
import { Option } from "antd/es/mentions";
import { DELIVERY_STATUS_COLORS } from "./OrderDetail";

export const DELIVERY_STATUS_VALUE = {
  PENDING: "Đang chờ xử lý",
  CONFIRM: "Đã xác nhận",
  PICKED_UP: "Đã lấy hàng",
  ON_THE_WAY: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
} as const;

export const DELIVERY_STATUS = {
  PENDING: "PENDING",
  CONFIRM: "CONFIRM",
  PICKED_UP: "PICKED_UP",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
} as const;

type DELIVERY_STATUS_TYPE =
  (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

const Order = () => {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleChangePage = async (page: number) => {
    getOrders(page);
  };
  const getOrders = async (
    page = 1,
    search = "",
    status = "",
    isPaymentStore = ""
  ) => {
    setLoading(true);
    try {
      http
        .get(
          `${API_URL}/admin/all-order?page=${page}&search=${search}&status=${status}&isPaymentStore=${isPaymentStore}`
        )
        .then((response) => {
          setOrders(response.data?.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    getOrders(1, value);

  const handleChange = async (value: string) => {
    getOrders(1, "", value);
  };
  const handleChange1 = async (value: string) => {
    getOrders(1, "", "", value);
  };

  return (
    <div className="px-15px px-lg-25px">
      <Spin spinning={loading} fullscreen />

      <div className="card">
        <form id="sort_orders" action="" method="GET">
          <div className="card-header row gutters-5">
            <div className="col text-center text-md-left">
              <h5 className="mb-md-0 h6">Đơn hàng</h5>
            </div>
          </div>
        </form>
        <div className="flex items-center gap-2 p-4">
          <Search
            placeholder="Gmail của shop"
            className="search-1"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
          <Select
            style={{ width: 300 }}
            placeholder="Tình trạng thanh toán"
            onChange={handleChange1}
          >
            <Option value="1">Đã thanh toán</Option>
            <Option value="0">Chưa thanh toán</Option>
          </Select>
          <Select
            style={{ width: 300 }}
            placeholder="Tình trạng giao hàng"
            onChange={handleChange}
          >
            <Option value={DELIVERY_STATUS.PENDING}>
              {DELIVERY_STATUS_VALUE.PENDING}
            </Option>
            <Option value={DELIVERY_STATUS.CONFIRM}>
              {DELIVERY_STATUS_VALUE.CONFIRM}
            </Option>
            <Option value={DELIVERY_STATUS.PICKED_UP}>
              {DELIVERY_STATUS_VALUE.PICKED_UP}
            </Option>
            <Option value={DELIVERY_STATUS.ON_THE_WAY}>
              {DELIVERY_STATUS_VALUE.ON_THE_WAY}
            </Option>
            <Option value={DELIVERY_STATUS.DELIVERED}>
              {DELIVERY_STATUS_VALUE.DELIVERED}
            </Option>
          </Select>
        </div>
        <div className="card-body p-3" style={{ overflow: "auto" }}>
          <table
            className="table aiz-table mb-0 footable footable-1 breakpoint breakpoint-md"
            style={{}}
          >
            <thead>
              <tr className="footable-header">
                <th style={{ display: "table-cell" }}>Mã đặt hàng:</th>

                <th data-breakpoints="lg" style={{ display: "table-cell" }}>
                  Khách hàng
                </th>
                <th data-breakpoints="lg" style={{ display: "table-cell" }}>
                  Cửa hàng
                </th>
                <th data-breakpoints="md" style={{ display: "table-cell" }}>
                  Số tiền
                </th>
                <th data-breakpoints="md" style={{ display: "table-cell" }}>
                  Profit
                </th>

                <th data-breakpoints="lg" style={{ display: "table-cell" }}>
                  Tình trạng giao hàng
                </th>

                <th data-breakpoints="lg" style={{ display: "table-cell" }}>
                  Tình trạng thanh toán cửa hàng
                </th>

                {/* <th style={{ display: 'table-cell' }}>Tình trạng thanh toán</th> */}
                <th
                  className="text-right footable-last-visible"
                  style={{ display: "table-cell" }}
                >
                  Tùy chọn
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.orders?.map((item: any) => (
                <tr>
                  <td style={{ display: "table-cell" }}>
                    <a href="#20240325-15453856">{item?._id}</a>
                  </td>

                  <td style={{ display: "table-cell" }}>
                    {item?.customer?.name}
                  </td>
                  <td style={{ display: "table-cell" }}>
                    {item?.user?.store?.nameStore}
                  </td>
                  <td style={{ display: "table-cell" }}>
                    ${(+item?.tongtien)?.toLocaleString()}
                  </td>
                  <td style={{ display: "table-cell" }}>
                    ${(+item?.profit)?.toLocaleString()}
                  </td>

                  <td style={{ display: "table-cell" }}>
                    {!!item?.status && (
                      <span
                        className={`badge badge-inline ${
                          (DELIVERY_STATUS_COLORS as any)[item.status]
                        }`}
                      >
                        {(DELIVERY_STATUS_VALUE as any)[item.status]}
                      </span>
                    )}
                  </td>
                  <td style={{ display: "table-cell" }}>
                    {!item?.isPayMentStore ? (
                      <span className="badge badge-inline badge-danger">
                        Chưa thanh toán
                      </span>
                    ) : (
                      <span className="badge badge-inline badge-success">
                        Đã thanh toán
                      </span>
                    )}
                  </td>
                  {/* <td style={{ display: 'table-cell' }}>
                    {!item?.isPayment ? (
                      <span className="badge badge-inline badge-danger">
                        Chưa thanh toán
                      </span>
                    ) : (
                      <span className="badge badge-inline badge-success">
                        Đã thanh toán
                      </span>
                    )}
                  </td> */}
                  <td
                    className="text-right footable-last-visible"
                    style={{ display: "table-cell" }}
                  >
                    <Link
                      to={"/order-detail"}
                      state={item}
                      className="btn btn-soft-info btn-icon btn-circle btn-sm"
                      title="Chi tiết đơn hàng"
                    >
                      <i className="fas fa-eye text-primary" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="aiz-pagination">
            <Pagination
              onChange={handleChangePage}
              defaultCurrent={1}
              total={orders?.total || 0}
              pageSize={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
