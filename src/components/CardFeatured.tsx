import Link from "next/link";
import { Article } from "@/data/articles";
import { formatDate } from "@/lib/formatDate";

interface CardFeaturedProps {
  article: Article;
}

export default function CardFeatured({ article }: Readonly<CardFeaturedProps>) {
  return (
    <article className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Imagen destacada - 1/3 del ancho */}
        <Link
          href={`/${article.slug}`}
          className="h-44 md:h-full md:col-span-1 bg-linear-to-br from-blue-600 to-purple-700 flex items-center justify-center relative group cursor-pointer"
          aria-label={`Ver artículo: ${article.title}`}
        >
          <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <span className="text-white text-6xl font-bold opacity-30 group-hover:opacity-40 transition-opacity z-10">
            CES
          </span>
        </Link>

        {/* Contenido - 2/3 del ancho */}
        <div className="flex flex-col justify-center p-5 md:p-7 md:col-span-2">
          {/* Categoría */}
          <span className="inline-block self-start px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
            {article.category}
          </span>

          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            <Link
              href={`/${article.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {article.title}
            </Link>
          </h2>

          {/* Descripción */}
          <p className="text-base text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {article.description}
          </p>

          {/* Meta información */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <strong className="text-gray-900">{article.author}</strong>
            </span>
            <time dateTime={article.publishedDate} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {formatDate(article.publishedDate, 'long')}
            </time>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
