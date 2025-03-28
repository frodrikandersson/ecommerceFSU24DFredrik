import { createBrowserRouter } from "react-router";
import { Homepage } from "./pages/Homepage";
import { Layout } from "./layouts/Layout";
import NotFound from "./components/NotFound";
import { Productpage } from "./pages/Productpage";
import { AdminPage } from "./pages/Adminpage";
import { Orderpage } from "./pages/Orderpage";
import { Authpage } from "./pages/Authpage";
import { Cartpage } from "./pages/Cartpage";
import { Successpage } from "./pages/Successpage";
import { Cancelpage } from "./pages/Cancelpage";

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
                path: "/auth",
                element: <Authpage />
            },
            {
                path: "/admin",
                element: <AdminPage />
            },
            {
                path: "/order",
                element: <Orderpage />
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
                path: "/cancel",
                element: <Cancelpage />
            }
        ],
    },
]);