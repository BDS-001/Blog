import App from "../layouts/App.jsx";
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute.jsx';
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import LoginPage from '../pages/LoginPage/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage/SignUpPage.jsx'
import AuthorHome from '../pages/HomePage/AuthorHome.jsx'
import BlogDetail from '../pages/BlogDetail/BlogDetail.jsx';

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ProtectedRoute> <AuthorHome/> </ProtectedRoute> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "blogs/:blogId", element: <ProtectedRoute><BlogDetail /></ProtectedRoute> }
    ],
  },
];

export default routes;