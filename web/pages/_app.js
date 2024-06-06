import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <main>
        <nav className="border-b p-6">
          <p className="text-4xl font-bold">Food Eaters</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 text-pink-500">Inicio</a>
            </Link>
            <Link href="/add-dish">
              <a className="mr-6 text-pink-500">Agregar platillos</a>
            </Link>
          </div>
        </nav>
      </main>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
