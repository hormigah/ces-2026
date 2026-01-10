import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">CES 2026</h2>
            <p className="text-sm text-gray-700">
              Cobertura completa del Consumer Electronics Show 2026.
              Las últimas tendencias en tecnología, innovación y futuro digital.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Navegación</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-700 hover:text-blue-800 transition-colors underline-offset-4 hover:underline"
                >
                  Inicio
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre el CES</h2>
            <p className="text-sm text-gray-700">
              El Consumer Electronics Show es el evento de tecnología más influyente del mundo,
              presentando innovaciones que transforman industrias.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 text-center">
            &copy; 2026 CES 2026 - Cobertura informativa.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
