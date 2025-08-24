import { createHashRouter } from "react-router-dom"
import App from '../App.jsx';
import { ErrorComponent, NotFoundPage } from "../components/error_component.jsx";
import { MainKmpsTree } from "../views/main_kmps_tree/main_kmps_tree.jsx";

export let routerKmpsTree = createHashRouter([
    {
        path: "/",
        element: <MainKmpsTree/>,
        children: [
            {
                index: true,
                element: <App/>,
                outlet: "main_kmps_tree"
            },
            {
                path: "api/*",
                element: <NotFoundPage/>,
          },
          {
            path:"*",
            element:<NotFoundPage/>
         }
          ],
      },
      
]);




