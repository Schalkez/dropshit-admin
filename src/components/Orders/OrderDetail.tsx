import { Select, message } from "antd";
import { Option } from "antd/es/mentions";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, store } from "../../store";
import http from "../../utils/http";
import { API_URL, handleErrorResponse } from "../../utils";

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

export const DELIVERY_STATUS_COLORS = {
  PENDING: "badge-warning", // Màu vàng cho trạng thái đang chờ xử lý
  CONFIRM: "badge-primary", // Màu xanh đậm cho trạng thái đã xác nhận
  PICKED_UP: "badge-info", // Màu xanh nhạt cho trạng thái đã lấy hàng
  ON_THE_WAY: "badge-secondary", // Màu xám nhẹ cho trạng thái đang giao hàng
  DELIVERED: "badge-success", // Màu xanh lá cho trạng thái đã giao hàng
} as const;

const OrderDetail = () => {
  const state: RootState = store.getState();
  const admin = state.admin as any;
  const location = useLocation();
  const order = location?.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async (val: string) => {
    updateOrder(val, null);
  };

  const handleChangeIsPayment = async (val: string) => {
    updateOrder(null, val);
  };

  const updateOrder = async (status: any, isPayment: any) => {
    setLoading(true);
    http
      .post(`${API_URL}/profile/updateOrder`, {
        orderId: order?._id,
        isPayment,
        status,
      })
      .then((response) => {
        setLoading(false);
        message.success("Success");
        console.log(response);
        navigate("/orders");
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });

    setLoading(false);
  };

  const handleResolvePaymentOrder = async () => {
    setLoading(true);
    http
      .post(`${API_URL}/admin/resolvePaymentOrder`, {
        orderId: order?._id,
        sellerId: order?.seller,
      })
      .then((response) => {
        handleChangeStatus(DELIVERY_STATUS.PICKED_UP);
        setLoading(false);
        message.success("Đã thanh toán đơn hàng cho kho");
        navigate("/orders");
      })
      .catch((error) => {
        handleErrorResponse(error);
        setLoading(false);
      });

    setLoading(false);
  };

  return (
    <div className="px-15px px-lg-25px">
      <div className="card">
        <div className="card-header">
          <h1 className="h2 fs-16 mb-0">Chi tiết đơn hàng</h1>
        </div>
        <div className="card-body">
          <div className="row gutters-3">
            <div className="col text-md-left text-center"></div>
            {/* <div className="col-md-2 d-flex flex-nowrap justify-content-end align-items-end ml-auto">
              <button type="button" className="btn btn-primary text-[#000]">
                Free up frozen funds
              </button>
            </div> */}
            <div className="col-md-3 d-flex flex-nowrap justify-content-end align-items-end ml-auto">
              {order?.isPayment ? (
                <button type="button" className="btn bg-success text-[#fff]">
                  Đã thanh toán cho kho
                </button>
              ) : (
                <button
                  type="button"
                  className="btn bg-warning !text-[#fff]"
                  onClick={handleResolvePaymentOrder}
                >
                  Thanh toán cho kho
                </button>
              )}
            </div>
            {/*Assign Delivery Boy*/}
            <div className="col-md-3 ml-auto">
              <label htmlFor="update_payment_status ">
                Tình trạng thanh toán
              </label>
              <div className="dropdown bootstrap-select form-control aiz-">
                <Select
                  placeholder="Tình trạng thanh toán"
                  onChange={handleChangeIsPayment}
                  defaultValue={order?.isPayment ? "1" : "0"}
                >
                  <Option value="0">Chưa thanh toán</Option>
                  <Option value="1">Đã thanh toán</Option>
                </Select>
              </div>
            </div>
            <div className="col-md-3 ml-auto">
              <label htmlFor="update_delivery_status">
                Tình trạng giao hàng
              </label>
              <Select
                defaultValue={order?.status}
                placeholder="Tình trạng giao hàng"
                onChange={handleChangeStatus}
                disabled={order?.status === DELIVERY_STATUS.DELIVERED}
              >
                <Option value={DELIVERY_STATUS.PENDING}>Đang chờ xử lý</Option>
                <Option value={DELIVERY_STATUS.CONFIRM}>Đã xác nhận</Option>
                <Option value={DELIVERY_STATUS.PICKED_UP}>Picked Up</Option>
                <Option value={DELIVERY_STATUS.ON_THE_WAY}>On The Way</Option>
                <Option value={DELIVERY_STATUS.DELIVERED}>Đã giao hàng</Option>
              </Select>
            </div>
          </div>

          <div className="row gutters-5 mt-3">
            <div className="col-4 text-md-left text-center">
              <address>
                <strong className="text-main">{order?.customer?.name}</strong>
                <br />
                {order?.customer?.email}
                <br />
                {order?.customer?.phone}
                <br />
                {order?.customer?.address}
                <br />
              </address>
            </div>
            <div className="col-md-8 ml-auto">
              <table>
                <tbody>
                  <tr>
                    <td className="text-main text-bold">Đặt hàng #</td>
                    <td className="text-info text-bold text-right">
                      {" "}
                      {order?._id}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-main text-bold">Tình trạng đặt hàng</td>
                    <td className="text-right">
                      <span className="badge badge-inline badge-success">
                        {order?.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-main text-bold">Ngày đặt hàng </td>
                    <td className="text-right">
                      {new Date(order?.createdAt)?.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-main text-bold">Tổng cộng</td>
                    <td className="text-right">
                      ${(+order?.tongtien)?.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-main text-bold">
                      Phương thức thanh toán
                    </td>
                    <td className="text-right">thanh toán khi giao hàng</td>
                  </tr>
                  <tr>
                    <td className="text-main text-bold">Thông tin bổ sung</td>
                    <td className="text-right" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr className="new-section-sm bord-no" />
          <div className="row">
            <div className="col-lg-12 table-responsive">
              <table
                className="table-bordered aiz-table invoice-summary table footable footable-1 breakpoint breakpoint-lg"
                style={{}}
              >
                <thead>
                  <tr className="bg-trans-dark footable-header">
                    <th
                      className="footable-first-visible"
                      style={{ display: "table-cell" }}
                    >
                      tấm hình
                    </th>
                    <th
                      className="text-uppercase footable-last-visible"
                      style={{ display: "table-cell" }}
                    >
                      Sự miêu tả
                    </th>
                    <th
                      data-breakpoints="lg"
                      className="text-uppercase"
                      style={{ display: "table-cell" }}
                    >
                      QTY
                    </th>
                    <th
                      data-breakpoints="lg"
                      className="min-col text-uppercase text-center"
                      style={{ display: "table-cell" }}
                    >
                      Giá bán
                    </th>
                    <th
                      data-breakpoints="lg"
                      className="min-col text-uppercase text-center"
                      style={{ display: "table-cell" }}
                    >
                      Toàn bộ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order?.product?.map((item: any) => (
                    <tr>
                      <td
                        className="footable-first-visible"
                        style={{ display: "table-cell" }}
                      >
                        <img height={50} src={item?.product?.images?.[0]} />
                      </td>

                      <td style={{ display: "table-cell" }}>
                        {item?.product?.name}
                      </td>
                      <td
                        className="text-center"
                        style={{ display: "table-cell" }}
                      >
                        {item?.quantity}
                      </td>
                      <td
                        className="text-center"
                        style={{ display: "table-cell" }}
                      >
                        ${(+item?.product?.finalPrice)?.toLocaleString()}
                      </td>
                      <td
                        className="text-center"
                        style={{ display: "table-cell" }}
                      >
                        $
                        {(
                          +item?.product?.finalPrice * item?.quantity
                        )?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <strong className="text-muted">Giá kho :</strong>
                  </td>
                  <td>
                    ${(+order?.tongtien - order?.profit)?.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong className="text-muted">Profit :</strong>
                  </td>
                  <td>${(+order?.profit)?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>
                    <strong className="text-muted">Tổng phụ :</strong>
                  </td>
                  <td>${(+order?.tongtien)?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>
                    <strong className="text-muted">Thuế :</strong>
                  </td>
                  <td>$0.00</td>
                </tr>
                <tr>
                  <td>
                    <strong className="text-muted">Đang chuyển hàng :</strong>
                  </td>
                  <td>$0.00</td>
                </tr>
                <tr>
                  <td>
                    <strong className="text-muted">Phiếu mua hàng :</strong>
                  </td>
                  <td>$0.00</td>
                </tr>
                <tr>
                  <td>
                    <strong className="text-muted">TOÀN BỘ :</strong>
                  </td>
                  <td className="text-muted h5">
                    ${(+order?.tongtien)?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "\n                #wuliu .form-control{ width:150px; display:inline-block; margin-top:10px;}\n                #wuliu .btn-add{   margin-left:10px; width:50px;}\n            ",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
