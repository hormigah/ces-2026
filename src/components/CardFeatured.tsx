import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { formatDate } from "@/utils";
import { DEFAULT_ARTICLE_IMAGE } from "@/config/constants";

interface CardFeaturedProps {
  article: Article;
}

export default function CardFeatured({ article }: Readonly<CardFeaturedProps>) {
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
    tags,
  } = article;

  return (
    <article className="w-full bg-white border border-gray-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Imagen destacada - 1/3 del ancho */}
        <Link
          href={`/${slug}`}
          className="h-44 md:h-full md:col-span-1 relative group overflow-hidden bg-gray-800"
          aria-label={`Ver artículo: ${title}`}
        >
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        </Link>

        {/* Contenido - 2/3 del ancho */}
        <div className="flex flex-col justify-center p-5 md:p-7 md:col-span-2">
          {/* Categoría */}
          <span className="inline-block self-start px-4 py-1.5 text-sm font-semibold text-blue-800 bg-blue-50 rounded-full mb-3">
            {category}
          </span>

          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            <Link
              href={`/${slug}`}
              className="hover:text-blue-800 transition-colors"
            >
              {title}
            </Link>
          </h2>

          {/* Descripción */}
          <p className="text-base text-gray-700 mb-4 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Meta información */}
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-300">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <strong className="text-gray-900">{author}</strong>
            </span>
            <time dateTime={publishedDate} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {formatDate(publishedDate, 'long')}
            </time>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-gray-200 text-gray-800 px-2.5 py-1 rounded-full"
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
