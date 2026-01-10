import Link from "next/link";
import type { Article } from "@/types";
import { formatDate } from "@/utils";

interface CardProps {
  article: Article;
}

export default function Card({ article }: Readonly<CardProps>) {
  return (
    <article className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Imagen - Izquierda en desktop */}
        <Link
          href={`/${article.slug}`}
          className="h-32 sm:h-auto sm:w-48 shrink-0 bg-gray-200 flex items-center justify-center group cursor-pointer"
          aria-label={`Ver artículo: ${article.title}`}
        >
          <span className="text-gray-500 text-4xl font-bold opacity-30 group-hover:opacity-50 transition-opacity">
            CES
          </span>
        </Link>

        {/* Contenido - Derecha */}
        <div className="flex flex-col justify-between p-4 flex-grow">
          <div>
            {/* Categoría */}
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-50 rounded-full mb-2">
              {article.category}
            </span>

            {/* Título */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
              <Link
                href={`/${article.slug}`}
                className="hover:text-blue-800 transition-colors"
              >
                {article.title}
              </Link>
            </h3>

            {/* Descripción */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* Footer con meta información */}
          <div className="flex items-center justify-between">
            {/* Meta información */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {article.author}
              </span>
              <time dateTime={article.publishedDate}>
                {formatDate(article.publishedDate, 'short')}
              </time>
            </div>

            {/* Enlace de lectura */}
            <Link
              href={`/${article.slug}`}
              className="inline-flex items-center gap-1 text-sm text-blue-800 hover:text-blue-900 font-medium transition-colors"
            >
              Leer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
