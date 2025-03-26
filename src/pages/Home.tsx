import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('welcome')}</h1>
      <p className="text-lg text-gray-300 max-w-xl">
        {t('description')}
      </p>
    </div>
  );
};

export default Home;
