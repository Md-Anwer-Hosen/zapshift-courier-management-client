import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import CreateAccount from "../pages/Auth/CreateAccount/CreateAccount";
import Covarage from "../pages/covarage/Covarage";
import SendParcel from "../pages/sendParcel/SendParcel";
import PrivetRoutes from "../PrivetRoutes/PrivetRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payments from "../pages/Dashboard/payments/Payments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/covarage",
        element: <Covarage />,
      },
      {
        path: "/sendParcel",
        element: (
          <PrivetRoutes>
            <SendParcel />
          </PrivetRoutes>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/createAccount",
        element: <CreateAccount />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRoutes>
        <DashboardLayout />
      </PrivetRoutes>
    ),
    children: [
      {
        index: true,
        element: <MyParcels />,
      },
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        element: <Payments />,
      },
    ],
  },
]);

export default router;
