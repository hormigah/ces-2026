import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-300 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-3xl font-bold text-gray-900">
              CES <span className="text-blue-800">2026</span>
            </div>
          </Link>

          <nav aria-label="Navegación principal">
            <ul className="flex gap-6 items-center">
              <li>
                <Link
                  href="/"
                  className="text-gray-800 hover:text-blue-800 transition-colors font-medium"
                >
                  Inicio
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-700 max-w-2xl">
            Descubre las últimas innovaciones en tecnología, IA, robótica y gadgets del evento
            tecnológico más importante del año
          </p>
        </div>
      </div>
    </header>
  );
}
