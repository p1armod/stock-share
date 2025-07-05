import { createBrowserRouter, Outlet } from "react-router-dom";
import { Home,About,Login,Signup,Profile,Watchlist,ProfileUpdate,StockDetail,News,Learn,CreateArticle,Article,EditArticle } from "../pages";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/news",
                element: <News />
            },
            {
                path: "/articles",
                
                children:[
                    {
                        path: "",
                        element: <Learn />
                    },
                    {
                        path: "/articles/:id",
                        element: <Article />
                    },
                    {
                        path: "/articles/edit/:id",
                        element: <EditArticle />
                    },
                ]
            },
            {
                path: "/stock/:symbol",
                element: <StockDetail />
            },
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: "/login",
                        element: <Login />
                    },
                    {
                        path: "/signup",
                        element: <Signup />
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children:[
                    {
                        path: "/profile",
                        element: <Outlet />,
                        children:[
                            {
                                path: "",
                                element: <Profile />
                            },
                            {
                                path: "update",
                                element: <ProfileUpdate />
                            }
                        ]
                    },
                    {
                        path: "/watchlist",
                        element: <Outlet />,
                        children:[
                            {
                                path: "",
                                element: <Watchlist />
                            }
                        ]
                    },
                    {
                        path: "/create-article",
                        element: <CreateArticle />
                    }
                ]
            }
        ]
    }
])

export default router;
