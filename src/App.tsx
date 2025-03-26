import AnimatedBackground from './components/AnimatedBackground';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <AnimatedBackground />
      <h1 style={{ color: 'white', position: 'relative' }}>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('es')}>ES</button>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
    </>
  );
}
export default App;
