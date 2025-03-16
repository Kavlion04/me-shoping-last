
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 flex flex-col">
          <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          <div className="flex-1 p-6 transition-all duration-300 ease-in-out">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
