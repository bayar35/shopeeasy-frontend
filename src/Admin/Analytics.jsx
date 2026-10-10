import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import { fetchDashboardStats } from "../features/analytics/analyticsSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import "./Analytics.css";

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#ef4444",
  "#6366f1",
];

function Analytics() {
  const dispatch = useDispatch();
  const {
    stats,
    orderStatus,
    salesLast7Days,
    topProducts,
    categorySales,
    recentOrders,
    recentUsers,
    loading,
    error,
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <>
        <PageTitle title="Analytics" />
        <Loader />
      </>
    );
  }

  // Order Status chart data
  const orderStatusData = [
    { name: "Processing", value: orderStatus.processing },
    { name: "Shipped", value: orderStatus.shipped },
    { name: "On The Way", value: orderStatus.onTheWay },
    { name: "Delivered", value: orderStatus.delivered },
    { name: "Cancelled", value: orderStatus.cancelled },
  ].filter((item) => item.value > 0);

  // Sales chart data
  const salesData = salesLast7Days.map((item) => ({
    date: item._id,
    revenue: item.revenue,
    orders: item.orders,
  }));

  // Category chart data
  const categoryData = categorySales.map((item) => ({
    name: item._id,
    revenue: item.totalRevenue,
    sold: item.totalSold,
  }));

  return (
    <>
      <PageTitle title="Analytics Dashboard" />
      <div className="analytics-container">
        <h1 className="analytics-title">📊 Analytics Dashboard</h1>

        {/* ============ STATS CARDS ============ */}
        <div className="stats-grid">
          <div className="stat-card stat-revenue">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Нийт борлуулалт</p>
              <h2 className="stat-value">
                {stats.totalRevenue.toLocaleString()}₮
              </h2>
            </div>
          </div>

          <div className="stat-card stat-orders">
            <div className="stat-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Нийт захиалга</p>
              <h2 className="stat-value">{stats.totalOrders}</h2>
            </div>
          </div>

          <div className="stat-card stat-products">
            <div className="stat-icon">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Нийт бүтээгдэхүүн</p>
              <h2 className="stat-value">{stats.totalProducts}</h2>
            </div>
          </div>

          <div className="stat-card stat-users">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Нийт хэрэглэгч</p>
              <h2 className="stat-value">{stats.totalUsers}</h2>
            </div>
          </div>
        </div>

        {/* ============ CHARTS ROW ============ */}
        <div className="charts-row">
          {/* Sales Chart */}
          <div className="chart-card chart-large">
            <h3 className="chart-title">
              <TrendingUp size={20} /> 7 хоногийн борлуулалт
            </h3>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Орлого (₮)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Захиалга"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">Өгөгдөл байхгүй</p>
            )}
          </div>

          {/* Order Status Chart */}
          <div className="chart-card chart-small">
            <h3 className="chart-title">Захиалгын статус</h3>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">Өгөгдөл байхгүй</p>
            )}
          </div>
        </div>

        {/* ============ TOP PRODUCTS + CATEGORY ============ */}
        <div className="charts-row">
          {/* Top Products */}
          <div className="chart-card chart-large">
            <h3 className="chart-title">🏆 Хамгийн их борлуулагдсан</h3>
            {topProducts.length > 0 ? (
              <div className="top-products-list">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="top-product-item">
                    <span className="product-rank">#{index + 1}</span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumb"
                    />
                    <div className="product-info-compact">
                      <p className="product-name">{product.name}</p>
                      <p className="product-sold">
                        {product.totalSold}ш зарагдсан
                      </p>
                    </div>
                    <span className="product-revenue">
                      {product.totalRevenue.toLocaleString()}₮
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Өгөгдөл байхгүй</p>
            )}
          </div>

          {/* Category Sales */}
          <div className="chart-card chart-small">
            <h3 className="chart-title">📦 Ангилалаар</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="revenue"
                    fill="#8b5cf6"
                    name="Орлого (₮)"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">Өгөгдөл байхгүй</p>
            )}
          </div>
        </div>

        {/* ============ RECENT ORDERS + USERS ============ */}
        <div className="charts-row">
          {/* Recent Orders */}
          <div className="chart-card chart-large">
            <h3 className="chart-title">🛒 Сүүлийн захиалгууд</h3>
            {recentOrders.length > 0 ? (
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Хэрэглэгч</th>
                    <th>Дүн</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id">
                          #{order._id.slice(-8)}
                        </span>
                      </td>
                      <td>{order.user?.name || "N/A"}</td>
                      <td>{order.totalPrice.toLocaleString()}₮</td>
                      <td>
                        <span
                          className={`status-badge status-${order.orderStatus
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">Өгөгдөл байхгүй</p>
            )}
          </div>

          {/* Recent Users */}
          <div className="chart-card chart-small">
            <h3 className="chart-title">👥 Сүүлийн хэрэглэгчид</h3>
            {recentUsers.length > 0 ? (
              <div className="recent-users-list">
                {recentUsers.map((user) => (
                  <div key={user._id} className="user-item">
                    <img
                      src={user.avatar?.url || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="user-avatar"
                    />
                    <div className="user-info-compact">
                      <p className="user-name">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <span
                      className={`role-badge role-${user.role}`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Өгөгдөл байхгүй</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;