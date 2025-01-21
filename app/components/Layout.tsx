import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <header className="flex flex-wrap justify-between items-center p-4 sm:p-6 bg-gray-900">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold">My Portfolio</h1>

        {/* Navigation */}
        <nav className="mt-4 sm:mt-0 space-x-4 sm:space-x-6 text-sm sm:text-base flex flex-wrap justify-center">
          <a href="#home" className="hover:text-primary block sm:inline">Home</a>
          <a href="#projects" className="hover:text-primary block sm:inline">Projects</a>
          <a href="#experience" className="hover:text-primary block sm:inline">Experience</a>
          <a href="#contact" className="hover:text-primary block sm:inline">Contact</a>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="mt-10 py-6 text-center bg-gray-900">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} My Portfolio. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
