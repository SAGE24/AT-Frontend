import { BrowserRouter, useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Reservation from './pages/Reservation';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/reservation', element: <Reservation /> },
  ])

  return routes;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout>
        <AppRoutes />
      </Layout>
      
    </BrowserRouter>
  )
}

export default App
