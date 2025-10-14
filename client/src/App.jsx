// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Invoices from "./pages/Invoices";
import Items from "./pages/Items";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/invoices"
            element={
              <MainLayout>
                <Invoices />
              </MainLayout>
            }
          />
          <Route
            path="/items"
            element={
              <MainLayout>
                <Items />
              </MainLayout>
            }
          />
          <Route
            path="/customers"
            element={
              <MainLayout>
                <Customers />
              </MainLayout>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <MainLayout>
                <CustomerDetails />
              </MainLayout>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
