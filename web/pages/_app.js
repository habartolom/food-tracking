import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import Link from "next/link";

export const AuthContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAddress = localStorage.getItem("userAddress");
      setIsAuthenticated(!!userAddress);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userAddress");
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div>
        <main>
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <a className="text-4xl font-bold text-red-600 hover:text-red-800">Food Eaters</a>
                  </Link>
                </div>
                <div className="hidden md:flex space-x-4">
                  <Link href="/">
                    <a className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium">Home</a>
                  </Link>
                  {!isAuthenticated ? (
                    <>
                      <Link href="/auth/register">
                        <a className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium">Registrarme</a>
                      </Link>
                      <Link href="/auth/login">
                        <a className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium">Iniciar Sesión</a>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/add-dish">
                        <a className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium">Agregar platillos</a>
                      </Link>
                      <Link href="/my-dishes">
                        <a className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium">Mis platillos</a>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium focus:outline-none"
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </main>
        <Component {...pageProps} />
      </div>
    </AuthContext.Provider>
  );
}

export default MyApp;
