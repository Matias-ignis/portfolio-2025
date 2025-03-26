import { useTranslation } from 'react-i18next';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

function App() {
  const { i18n } = useTranslation();

  return (
    <MainLayout>
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => i18n.changeLanguage('es')} className="px-3 py-1 bg-white text-black rounded">ES</button>
        <button onClick={() => i18n.changeLanguage('en')} className="px-3 py-1 bg-white text-black rounded">EN</button>
      </div>
      <Home />
    </MainLayout>
  );
}

export default App;
