import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { formatDate } from "@/utils";
import { DEFAULT_ARTICLE_IMAGE } from "@/config/constants";

interface CardProps {
  article: Article;
}

export default function Card({ article }: Readonly<CardProps>) {
  // Desestructuración del artículo
  const {
    slug,
    title,
    description,
    category,
    author,
    publishedDate,
    imageUrl = DEFAULT_ARTICLE_IMAGE,
    imageAlt,
  } = article;

  return (
    <article className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Imagen - Izquierda en desktop */}
        <Link
          href={`/${slug}`}
          className="h-32 sm:h-auto sm:w-48 shrink-0 relative group overflow-hidden bg-gray-200"
          aria-label={`Ver artículo: ${title}`}
        >
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Contenido - Derecha */}
        <div className="flex flex-col justify-between p-4 grow">
          <div>
            {/* Categoría */}
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-50 rounded-full mb-2">
              {category}
            </span>

            {/* Título */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
              <Link
                href={`/${slug}`}
                className="hover:text-blue-800 transition-colors"
              >
                {title}
              </Link>
            </h3>

            {/* Descripción */}
            <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
              {description}
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
                {author}
              </span>
              <time dateTime={publishedDate}>
                {formatDate(publishedDate, 'long')}
              </time>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
