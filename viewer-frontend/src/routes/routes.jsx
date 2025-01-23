import App from "../layouts/App.jsx";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import HomePage from '../pages/HomePage/HomePage.jsx'
import BlogDetails from "../pages/BlogDetails/BlogDetails.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {path: '/blog/:slug', element: <BlogDetails/>}
    ],
  },
];

export default routes;