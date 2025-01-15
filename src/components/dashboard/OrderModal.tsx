import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import http from "../../utils/http";
import { API_URL } from "../../utils";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

type AddToCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

const OrderModal: React.FC<AddToCartProps> = ({
  isOpen,
  onClose,
}: AddToCartProps) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(false);

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
          setOrders(response.data?.data.orders);
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

  return (
    <Modal footer={null} closeIcon={false} open={false} width={600}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Đặt hàng</h5>
          <button type="button" data-dismiss="modal" onClick={onClose}>
            <CloseOutlined sizes={"large"} />
          </button>
        </div>
        <div className="modal-body d-flex flex-column" style={{ gap: "15px" }}>
          {orders.map((order: any, index: number) => (
            <div className="row" key={index}>
              <div className="col-12">{formatDate(order.createdAt)}</div>
              <div className="col-12 fs-14 text-primary flex">
                <span className="mr-1">Mã đặt hàng:</span>
                <span
                  onClick={() => navigate(`/orders`)}
                  className="fw-600 cursor-pointer"
                  title="Chi tiết đơn hàng"
                >
                  {order._id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
