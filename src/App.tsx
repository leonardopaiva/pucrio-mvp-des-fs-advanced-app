import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import './App.css'
import appRoutes from './routes/appRoutes';


const router = createBrowserRouter(appRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
