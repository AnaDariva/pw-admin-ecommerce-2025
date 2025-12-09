import { Route, Routes } from "react-router-dom";

// PÚBLICO
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";

// AUTH
import { RequireAuth } from "@/components/require-auth";
import RequireAdmin from "@/components/require-auth/require-admin";

// LAYOUT
import { Layout } from "@/components/layout";

// PÁGINAS
import { NotFound } from "@/pages/not-found";
import { ProductView } from "@/pages/product-view";
import { CartPage } from "@/pages/Cart";
import { CheckoutPage } from "@/pages/Checkout";
import { OrderHistoryPage } from "@/pages/OrderHistory";
import { ProductListPage } from "@/pages/product-list";

// ADMIN
import AdminDashboard from "@/pages/admin/Dashboard/index";

// ADMIN - USERS


// ADMIN - ORDERS
import AdminOrdersPage from "@/pages/admin/Dashboard/orders/index";
import AdminOrderDetailPage from "@/pages/admin/Dashboard/orders/detail";
import AdminUsersPage from "@/pages/admin/Dashboard/users/users.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>

                {/* ROTAS PÚBLICAS */}
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/:id" element={<ProductView />} />
                <Route path="cart" element={<CartPage />} />

                {/* ROTAS DO CLIENTE */}
                <Route element={<RequireAuth />}>
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                </Route>

                {/* ROTAS ADMIN */}
                <Route element={<RequireAdmin />}>
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/users" element={<AdminUsersPage />} />
                    <Route path="admin/orders" element={<AdminOrdersPage />} />
                    <Route path="admin/orders/:id" element={<AdminOrderDetailPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
