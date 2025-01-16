import App from "../layouts/App.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import LoginPage from '../pages/LoginPage/LoginPage.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LoginPage /> },
    //   { path: "contact", element: <ContactPage /> },
    ],
  },
];

export default routes;