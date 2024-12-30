import React, { useEffect, useState } from "react";
import { RootState, store } from "../../store";
import { Button, Select, message } from "antd";
import http from "../../utils/http";
import { API_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const Pos = () => {
  const state: RootState = store.getState();
  const admin = state.admin as any;
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const [productsSelected, setProductsSelected] = useState<any>([]);
  const [dataCustomer, setDataCustomer] = useState<any>([]);
  const [selectedCustomer, setSelectCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const naviagte = useNavigate();
  const handleChange = (value: string) => {
    setUserSelected(value);
  };
  const handleChange1 = (value: string) => {
    setSelectCustomer(value);
  };

  const getDataStore = async () => {
    try {
      http
        .get(`${API_URL}/admin/all-stores`)
        .then((response) => {
          setUsers(response.data?.data);
        })
        .catch((error) => {});
    } catch (error) {}
  };

  const getProductsByUser = async () => {
    http
      .get(`${API_URL}/profile/get-product-user-employee/${userSelected}`)
      .then((response) => {
        setProducts(response.data?.data);
      })
      .catch((error) => {});
  };
  const handleDelete = (prod: any) => {
    const newProd = productsSelected?.filter(
      (item: any) => item?.id !== prod?._id
    );
    setProductsSelected(newProd);
  };
  const getDataC = async () => {
    try {
      http
        .get(`${API_URL}/profile/get-virtual`)
        .then((response) => {
          setDataCustomer(response.data?.data);
        })
        .catch((error) => {});
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer) return message.warning("Chưa chọn khách hàng");
    if (!productsSelected?.length) return message.warning("Chưa chọn sản phẩm");
    setLoading(true);
    http
      .post(`${API_URL}/profile/add-order`, {
        products: productsSelected,
        user_store: userSelected,
        user_customer: selectedCustomer,
      })
      .then((response) => {
        setLoading(false);
        message.success("Success");
        console.log(response);
        naviagte("/orders");
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDataC();
    getDataStore();
  }, []);

  useEffect(() => {
    if (userSelected) getProductsByUser();
  }, [userSelected]);

  const getTotalPayment = () => {
    let total = 0;
    productsSelected?.map((item: any) => {
      total += item?.product?.price * item?.quantity;
    });
    return total;
  };
  const handleSelectedProducts = (prod: any) => {
    const productFind = productsSelected?.find(
      (item: any) => item?.id === prod?._id
    );

    if (productFind) {
      const updatedProducts = productsSelected.map((item: any) => {
        if (item.id === prod?._id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      setProductsSelected(updatedProducts);
    } else {
      setProductsSelected([
        ...productsSelected,
        {
          id: prod?._id,
          product: prod,
          quantity: 1,
        },
      ]);
    }
  };
  const handleExProducts = (prod: any) => {
    const productFind = productsSelected?.find(
      (item: any) => item?.id === prod?._id
    );

    if (productFind) {
      const updatedProducts = productsSelected.map((item: any) => {
        if (item.id === prod?._id) {
          if (item.quantity === 1) {
            return {
              ...item,
              quantity: 1,
            };
          }
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      setProductsSelected(updatedProducts);
    } else {
      setProductsSelected([
        ...productsSelected,
        {
          id: prod?._id,
          product: prod,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <div className="aiz-main-content">
      <div className="px-15px px-lg-25px">
        <div className="row gutters-5">
          <div className="col-md">
            <div className="row gutters-5 mb-3">
              <div className="col-md-3 col-6">
                <div className="">
                  <Select
                    onChange={handleChange}
                    placeholder="Chọn cửa hàng"
                    style={{ width: 250 }}
                    className="dropdown bootstrap-select form-control form-control-lg aiz-"
                    options={users?.map((item: any) => {
                      return {
                        value: item?._id,
                        label: item?.name,
                      };
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="aiz-pos-product-list c-scrollbar-light">
              <div
                className="d-flex flex-wrap justify-content-center"
                id="product-list"
              >
                {!!products?.length &&
                  products?.map((item: any) => (
                    <div className="w-140px w-xl-180px w-xxl-210px mx-2">
                      <div className="card bg-white c-pointer product-card hov-container">
                        <div className="position-relative">
                          <span className="absolute-top-left mt-1 ml-1 mr-0">
                            <span className="badge badge-inline badge-success fs-13">
                              Trong kho : {item?.quantity}
                            </span>
                          </span>
                          <span className="badge badge-inline badge-warning absolute-bottom-left mb-1 ml-1 mr-0 fs-13 text-truncate" />
                          <img
                            src={item?.images?.[0]}
                            className="card-img-top img-fit h-120px h-xl-180px h-xxl-210px mw-100 mx-auto"
                          />
                        </div>
                        <div className="card-body p-2 p-xl-3">
                          <div className="text-truncate fw-600 fs-14 mb-2">
                            {item?.name}
                          </div>
                          <div className="">
                            <span>${(+item?.price)?.toLocaleString()}</span>
                          </div>
                        </div>
                        <div
                          className="add-plus absolute-full rounded overflow-hidden hov-box "
                          onClick={() => handleSelectedProducts(item)}
                        >
                          <div className="absolute-full bg-dark opacity-50"></div>
                          <i className="fas fa-plus absolute-center la-3x text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {!products?.length && (
                <div id="load-more" className="text-center">
                  <div className="fs-14 d-inline-block fw-600 btn btn-soft-primary c-pointer">
                    Nothing more found.
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 w-md-350px w-lg-400px w-xl-500px">
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex border-bottom pb-3">
                  <div className="flex-grow-1">
                    <Select
                      onChange={handleChange1}
                      placeholder="Chọn khách hàng"
                      style={{ width: "100%" }}
                      className="dropdown bootstrap-select form-control form-control-lg aiz-"
                      options={dataCustomer?.map((item: any) => {
                        return {
                          value: item?._id,
                          label: item?.name,
                        };
                      })}
                    />
                  </div>
                </div>
                <div className="" id="cart-details">
                  {!productsSelected?.length && (
                    <div className="aiz-pos-cart-list mb-4 mt-3 c-scrollbar-light">
                      <div className="text-center">
                        <i className="fa-regular fa-face-frown"></i>
                        <p>Không có sản phẩm được thêm vào</p>
                      </div>
                    </div>
                  )}

                  <div className="aiz-pos-cart-list mb-4 mt-3 c-scrollbar-light">
                    <ul className="list-group list-group-flush">
                      {productsSelected?.map((item: any) => (
                        <li className="list-group-item py-0 pl-2">
                          <div className="row gutters-5 align-items-center">
                            <div className="col-auto w-60px">
                              <div className="row no-gutters align-items-center flex-column aiz-plus-minus">
                                <button
                                  className="btn col-auto btn-icon btn-sm fs-15"
                                  type="button"
                                  data-type="plus"
                                  data-field="qty-0"
                                  onClick={() =>
                                    handleSelectedProducts(item?.product)
                                  }
                                >
                                  <i className="fas fa-plus" />
                                </button>
                                <span>{item?.quantity}</span>
                                <button
                                  className="btn col-auto btn-icon btn-sm fs-15"
                                  type="button"
                                  data-type="minus"
                                  data-field="qty-0"
                                  onClick={() =>
                                    handleExProducts(item?.product)
                                  }
                                >
                                  <i className="fas fa-minus" />
                                </button>
                              </div>
                            </div>
                            <div className="col">
                              <div className="text-truncate-2">
                                {item?.product?.name}
                              </div>
                              <span className="span badge badge-inline fs-12 badge-soft-secondary" />
                            </div>
                            <div className="col-auto">
                              <div className="fs-12 opacity-60">
                                ${(+item?.product?.price)?.toLocaleString()} x{" "}
                                {item?.quantity}
                              </div>
                              <div className="fs-15 fw-600">
                                $
                                {(
                                  +item?.product?.price * item?.quantity
                                )?.toLocaleString()}
                              </div>
                            </div>
                            <div className="col-auto">
                              <button
                                type="button"
                                className="btn btn-circle btn-icon btn-sm btn-soft-danger ml-2 mr-0"
                                onClick={() => handleDelete(item?.product)}
                              >
                                <i className="fas fa-trash-alt" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-600 mb-2 opacity-70">
                      <span>Tổng phụ</span>
                      <span>${(+getTotalPayment())?.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-600 mb-2 opacity-70">
                      <span>Thuế</span>
                      <span>$0.00</span>
                    </div>
                    <div className="d-flex justify-content-between fw-600 mb-2 opacity-70">
                      <span>Đang chuyển hàng</span>
                      <span>$0.00</span>
                    </div>
                    <div className="d-flex justify-content-between fw-600 mb-2 opacity-70">
                      <span>Giảm giá</span>
                      <span>$0.00</span>
                    </div>
                    <div className="d-flex justify-content-between fw-600 fs-18 border-top pt-2">
                      <span>TOÀN BỘ</span>
                      <span>${(+getTotalPayment())?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pos-footer mar-btm">
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="d-flex">
                  <div className="dropdown mr-3 ml-0 dropup">
                    <button
                      className="btn btn-outline-dark btn-styled dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                    >
                      Đang chuyển hàng
                    </button>
                    <div className="dropdown-menu p-3 dropdown-menu-lg">
                      <div className="input-group">
                        <input
                          type="number"
                          min={0}
                          placeholder="Amount"
                          name="shipping"
                          className="form-control"
                          defaultValue={0}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">Bằng phẳng</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown dropup">
                    <button
                      className="btn btn-outline-dark btn-styled dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                    >
                      Giảm giá
                    </button>
                    <div className="dropdown-menu p-3 dropdown-menu-lg">
                      <div className="input-group">
                        <input
                          type="number"
                          min={0}
                          placeholder="Amount"
                          name="discount"
                          className="form-control"
                          defaultValue={0}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">Bằng phẳng</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-2 my-md-0">
                  <Button
                    loading={loading}
                    onClick={handleCreateOrder}
                    type="primary"
                    className="bg-primary"
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pos;
