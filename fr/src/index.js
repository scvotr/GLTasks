import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';
import { AuthProvider } from './context/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <RouterProvider router={routes}/>
  </AuthProvider>
)