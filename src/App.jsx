import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import { useEffect } from "react";

import AppLayout from "./components/layout/AppLayout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Destinations from "./pages/Destinations.jsx";
import Trips from "./pages/Trips.jsx";
import Customers from "./pages/Customers.jsx";
import Bookings from "./pages/Bookings.jsx";
import Payments from "./pages/Payments.jsx";
import Calendar from "./pages/Calendar.jsx";
import Analytics from "./pages/Analytics.jsx";

import Button from "./components/common/Button.jsx";


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <div>
          <div
            style={{
              fontSize: "72px",
              fontWeight: "800",
              lineHeight: "1",
              marginBottom: "15px"
            }}
          >
            404
          </div>

          <h2>
            Page Not Found
          </h2>

          <p>
            The page you are looking for
            does not exist or may have
            been moved.
          </p>

          <div
            style={{
              marginTop: "20px"
            }}
          >
            <Button
              variant="primary"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<AppLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="destinations"
            element={<Destinations />}
          />

          <Route
            path="trips"
            element={<Trips />}
          />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

          <Route
            path="payments"
            element={<Payments />}
          />

          <Route
            path="calendar"
            element={<Calendar />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>
      </Routes>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;