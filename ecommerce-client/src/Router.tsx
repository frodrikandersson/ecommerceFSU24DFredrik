import { createBrowserRouter } from "react-router";
import { Homepage } from "./pages/Homepage";
import { Layout } from "./layouts/Layout";
import NotFound from "./components/NotFound";
import { Productpage } from "./pages/Productpage";
import { AdminPage } from "./pages/Adminpage";
import { Cartpage } from "./pages/Cartpage";
import { Successpage } from "./pages/Successpage";
import { Authpage } from "./pages/Authpage";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Layout />,
        errorElement: <NotFound />,
        children:[
            {
                path: "/",
                element: <Homepage />
            },
            {
                path: "/productpage",
                element: <Productpage />
            },
            {
                path: "/admin",
                element: <AdminPage />
            },
            {
                path: "/cart",
                element: <Cartpage />
            },
            {
                path: "/success",
                element: <Successpage />
            },
            {
                path: "/auth",
                element: <Authpage />
            },
        ],
    },
]);