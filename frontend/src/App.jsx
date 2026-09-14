import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import AuthInitializer from './components/auth/AuthInitializer';

const App = () => (
  <BrowserRouter>
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  </BrowserRouter>
);

export default App;
