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
    window.location.href = '/'; // Redirigir a la página de inicio después de cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <div>
        <main>
          <nav className="border-b p-6">
            <p className="text-4xl font-bold">Food Eaters</p>
            <div className="flex mt-4">
              <Link href="/">
                <a className="mr-4 text-pink-500">Inicio</a>
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/register">
                    <a className="mr-6 text-pink-500">Registrarme</a>
                  </Link>
                  <Link href="/auth/login">
                    <a className="mr-6 text-pink-500">Iniciar Sesión</a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/add-dish">
                    <a className="mr-6 text-pink-500">Agregar platillos</a>
                  </Link>
                  <Link href="/my-dishes">
                    <a className="mr-6 text-pink-500">Mis platillos</a>
                  </Link>
                  <button onClick={handleLogout} className="mr-6 text-pink-500">Cerrar Sesión</button>
                </>
              )}
            </div>
          </nav>
        </main>
        <Component {...pageProps} />
      </div>
    </AuthContext.Provider>
  );
}

export default MyApp;
