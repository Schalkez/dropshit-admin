import { useEffect, useState } from "react";
import BasePageContainer from "../layout/PageContainer";
import {
  Avatar,
  BreadcrumbProps,
  Card,
  Col,
  List,
  Progress,
  Rate,
  Row,
  Table,
  Tag,
} from "antd";
import { webRoutes } from "../../routes/web";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import { AiOutlineStar, AiOutlineTeam } from "react-icons/ai";
import Icon from "@ant-design/icons";
import { BiCommentDetail, BiPhotoAlbum } from "react-icons/bi";
import { MdOutlineArticle, MdOutlinePhoto } from "react-icons/md";
import { StatisticCard } from "@ant-design/pro-components";
import LazyImage from "../lazy-image";
import { User } from "../../interfaces/models/user";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { handleErrorResponse } from "../../utils";
import { Review } from "../../interfaces/models/review";
import SalesChart from "./Chart";
import OrderModal from "./OrderModal";

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={"#"}>Dashboard</Link>,
    },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([loadUsers(), loadReviews()])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }, []);

  const loadUsers = () => {
    return http
      .get(apiRoutes.users, {
        params: {
          per_page: 4,
        },
      })
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  const loadReviews = () => {
    return http
      .get(apiRoutes.reviews, {
        params: {
          per_page: 5,
        },
      })
      .then((response) => {
        setReviews(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.data.data.map((rawReview: any) => {
            const review: Review = {
              id: rawReview.id,
              title: rawReview.name,
              color: rawReview.color,
              year: rawReview.year,
              star: Math.floor(Math.random() * 5) + 1,
            };

            return review;
          })
        );
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineTeam} />}
            title="Users"
            number={12}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlineArticle} />}
            title="Posts"
            number={100}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiPhotoAlbum} />}
            title="Albums"
            number={100}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlinePhoto} />}
            title="Photos"
            number={500}
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            title="Lượt truy cập hàng ngày"
            number={3}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            title="Lượt truy cập hàng tuân"
            number={32}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            title="Lượt truy cập hàng tháng"
            number={96}
          />
        </Col>
      </Row>

      {/* Sales Chart */}
      <SalesChart />

      {/* Order Modal */}
      <OrderModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BasePageContainer>
  );
};

export default Dashboard;
