import App from "../layouts/App.jsx";
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute.jsx';
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import LoginPage from '../pages/LoginPage/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage/SignUpPage.jsx'
import AuthorHome from '../pages/HomePage/AuthorHome.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ProtectedRoute> <AuthorHome/> </ProtectedRoute> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
];

export default routes;