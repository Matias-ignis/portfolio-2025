import { ReactNode } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="relative z-0">
      <AnimatedBackground />
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default MainLayout;
