
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import TopBar from './TopBar';

/**
 * Layout component
 * Provides the main application layout with sidebar and top navigation
 */
const Layout = () => {
  // State for controlling sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar navigation */}
        <AppSidebar isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 flex flex-col">
          {/* Top navigation bar */}
          <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          {/* Main content area */}
          <div className="flex-1 p-6 transition-all duration-300 ease-in-out">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
