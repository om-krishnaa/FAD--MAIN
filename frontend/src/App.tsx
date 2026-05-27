import AppRoutes from './routes/AppRoutes';
import './index.css';
import { useDarkMode } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <AppRoutes />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
