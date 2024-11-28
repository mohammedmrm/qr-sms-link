import { MainProvider } from '@/contexts/context';
import router from '@/router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <MainProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </MainProvider>
  );
}

export default App;
