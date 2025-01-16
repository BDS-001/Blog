import App from "../layouts/App.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import HomePage from '../pages/HomePage/HomePage.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
    //   { path: "contact", element: <ContactPage /> },
    ],
  },
];

export default routes;