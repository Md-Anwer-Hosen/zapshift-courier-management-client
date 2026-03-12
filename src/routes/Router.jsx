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
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TracParcel from "../pages/Dashboard/TracParcel/TracParcel";
import BeARider from "../pages/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoutes from "../PrivetRoutes/AdminRoutes";

import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import MyTask from "../pages/Dashboard/MyTask/MyTask";
import RiderRoutes from "../PrivetRoutes/RiderRoutes";
import CompleatedTask from "../pages/Dashboard/CompleatedTask/CompleatedTask";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import Error404 from "../pages/Error404/Error404";

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
      {
        path: "forbidden",
        element: <Forbidden />,
      },
      {
        path: "beARider",
        element: <BeARider />,
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
        element: <DashboardHome />,
      },
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        element: <Payments />,
      },
      {
        path: "paymentHistory",
        element: <PaymentHistory />,
      },
      {
        path: "tracParcel",
        element: <TracParcel />,
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoutes>
            {" "}
            <PendingRiders />
          </AdminRoutes>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoutes>
            <ActiveRiders />
          </AdminRoutes>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoutes>
            <MakeAdmin />
          </AdminRoutes>
        ),
      },
      {
        path: "asignRider",
        element: (
          <AdminRoutes>
            <AssignRider />
          </AdminRoutes>
        ),
      },
      {
        path: "mytask",
        element: (
          <RiderRoutes>
            <MyTask />
          </RiderRoutes>
        ),
      },
      {
        path: "compleatedTask",
        element: (
          <RiderRoutes>
            <CompleatedTask />
          </RiderRoutes>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;
