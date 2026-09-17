import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "./app/NotFoundPage";
import {
  ConsoleLayout,
  hasPermission,
} from "./components/layout/ConsoleLayout";
import { Login } from "./features/auth/Login";
import { CategoriesPage } from "./features/catalog/CategoriesPage";
import { CustomersPage } from "./features/customers/CustomersPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { BannersPage, CouponsPage } from "./features/marketing/MarketingPages";
import { OrdersPage } from "./features/orders/OrdersPage";
import { ProductsPage } from "./features/products/ProductsPage";
import {
  AdminUsersPage,
  LogsPage,
  RolesPage,
} from "./features/system/SystemPages";
import type { Auth } from "./types";

/**
 * 根组件只做两件事：恢复登录态、声明路由。具体业务页面全部放在 features 下，
 * 应用壳与通用组件不再和具体商品/订单逻辑耦合。
 */
export default function App() {
  const [auth, setAuth] = useState<Auth | null>(() => {
    const raw = localStorage.getItem("yunqi-auth");
    return raw ? JSON.parse(raw) : null;
  });
  if (!auth) return <Login onLogin={setAuth} />;
  return (
    <ConsoleLayout
      auth={auth}
      onLogout={() => {
        localStorage.clear();
        setAuth(null);
      }}
    >
      <Routes>
        {/* 根路径是业务入口，不应该吞掉所有未知 URL。 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/products"
          element={<ProductsPage canEdit={hasPermission(auth, "product:*")} />}
        />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/orders"
          element={<OrdersPage canEdit={hasPermission(auth, "order:*")} />}
        />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/banners" element={<BannersPage />} />
        <Route path="/admin-users" element={<AdminUsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/logs" element={<LogsPage />} />
        {/* 只匹配未定义的前端路径，保留用户发现问题与返回的机会。 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ConsoleLayout>
  );
}
