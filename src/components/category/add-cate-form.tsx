import {
  Button,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Upload,
  UploadProps,
} from "antd";
import React, { useRef, useState } from "react";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { ActionType } from "@ant-design/pro-components";
import { handleErrorResponse } from "../../utils";
import { UploadOutlined } from "@ant-design/icons";

export const AddCateForm = ({
  parentCategoryId,
  isOpen,
  setIsOpen,
  getCate,
}: any) => {
  const actionRef = useRef<FormInstance<any>>(null);

  const [imgLoading, setImgLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");

  const props: UploadProps = {
    name: "file",
    action: `${import.meta.env.VITE_API_URL}/upload/file`,
    beforeUpload: (file) => {
      setImgLoading(true);
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
  console.log(parentCategoryId);
  const onSubmit = async (form: any) => {
    if (imgLoading) return;

    setLoading(true);

    try {
      await http.post(apiRoutes.category, {
        name: form,
        parentCategoryId,
        img,
      });

      actionRef.current?.resetFields();
      message.success("Success");
      await getCate();
      setIsOpen(false);
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      open={isOpen}
      footer={null}
      onCancel={() => {
        setIsOpen(false);
        setImgLoading(false);
        setLoading(false);
        setImg("");
      }}
    >
      <Form ref={actionRef} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label={
            <div>
              Tên
              <img
                src={
                  "https://www.albbcbe-cme-vn.com/public/assets/img/flags/vn.png"
                }
              />
            </div>
          }
          name={"vi"}
        >
          <Input required className="h-[40px]" />
        </Form.Item>
        <Form.Item
          label={
            <div>
              Tên
              <img
                src={
                  "https://www.albbcbe-cme-vn.com/public/assets/img/flags/en.png"
                }
              />
            </div>
          }
          name={"en"}
        >
          <Input required className="h-[40px]" />
        </Form.Item>
        <Form.Item
          label={
            <div>
              Tên
              <img
                src={
                  "https://www.albbcbe-cme-vn.com/public/assets/img/flags/cn.png"
                }
              />
            </div>
          }
          name={"cn"}
        >
          <Input required className="h-[40px]" />
        </Form.Item>
        <Form.Item
          label={
            <div>
              Tên
              <img
                src={
                  "https://www.albbcbe-cme-vn.com/public/assets/img/flags/hk.png"
                }
              />
            </div>
          }
          name={"hk"}
        >
          <Input required className="h-[40px]" />
        </Form.Item>
        <Form.Item
          label={
            <div>
              Tên
              <img
                src={
                  "https://www.albbcbe-cme-vn.com/public/assets/img/flags/kr.png"
                }
              />
            </div>
          }
          name={"kr"}
        >
          <Input required className="h-[40px]" />
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
    </Modal>
  );
};
