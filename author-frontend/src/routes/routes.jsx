import App from "../layouts/App.jsx";
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute.jsx';
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import LoginPage from '../pages/LoginPage/LoginPage.jsx';
import HomePage from '../pages/HomePage/HomePage.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ProtectedRoute> <HomePage/> </ProtectedRoute> },
      { path: "login", element: <LoginPage /> },
    ],
  },
];

export default routes;