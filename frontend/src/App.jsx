import RadarPage from './pages/RadarPage.jsx';
import MobileBlock from './components/MobileBlock.jsx';
import useIsMobile from './hooks/useIsMobile.js';

function App() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileBlock /> : <RadarPage />;
}

export default App;
