import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { routerKmpsTree } from './router/router.jsx';
import {ErrorComponent} from './components/error_component.jsx'
import './index.css'
// window.addEventListener('storage', (event) => { setState("изменено")});

let rootElem = document.getElementById('root');

function RootComponent({name_component}){
    console.log(name_component);
    if (name_component == 'kmps_tree'){
        return <RouterProvider router={routerKmpsTree} />
    } else {
        return <ErrorComponent/>
    }

};


createRoot(document.getElementById('root')).render(
    <RootComponent name_component={rootElem.dataset.name_component}/>
    
)
