import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Content from "@/components/Content";
import { getArticleBySlug } from "@/data/articles";
import { formatDate } from "@/utils";
import { articles } from "@/app/api/articles/route";
import { DEFAULT_ARTICLE_IMAGE, SITE_LOGO_URL } from "@/config/constants";

export interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generación de metadata dinámica para SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artículo no encontrado - CES 2026",
      description: "El artículo solicitado no existe.",
    };
  }

  return {
    title: `${article.title} - CES 2026`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
      tags: article.tags,
      images: article.imageUrl ? [
        {
          url: article.imageUrl,
          alt: article.imageAlt || article.title,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    keywords: article.tags.join(", "),
  };
}

// Generación estática de parámetros (SSG) - CLAVE para SEO
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  // Manejo de 404 si el artículo no existe
  if (!article) {
    notFound();
  }

  // Desestructuración del artículo
  const {
    title,
    description,
    content,
    category,
    author,
    publishedDate,
    imageUrl = DEFAULT_ARTICLE_IMAGE,
    imageAlt,
    tags,
  } = article;

  // Datos estructurados JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "CES 2026",
      "logo": {
        "@type": "ImageObject",
        "url": SITE_LOGO_URL
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ces2026.com/${slug}`
    },
    "articleSection": category,
    "keywords": tags.join(", ")
  };

  return (
    <>
      {/* JSON-LD para datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Content>
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          {/* Encabezado del artículo */}
          <header className="mb-8">
            {/* Breadcrumb para navegación y SEO */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-700">
                <li>
                  <a href="/" className="hover:text-blue-800 transition-colors">
                    Inicio
                  </a>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-900" aria-current="page">
                  {category}
                </li>
              </ol>
            </nav>

            {/* Categoría */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-50 rounded-full">
                {category}
              </span>
            </div>

            {/* Título principal - h1 para SEO */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            {/* Imagen del artículo */}
            <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                className="object-cover"
                priority
              />
            </div>

            {/* Meta información del artículo */}
            <div className="flex flex-wrap items-center gap-4 text-gray-700 text-sm border-b border-gray-300 pb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>
                  Por <strong className="text-gray-900">{author}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time dateTime={publishedDate}>
                  {formatDate(publishedDate, 'long')}
                </time>
              </div>
            </div>

            {/* Descripción/Sumario */}
            <p className="text-xl text-gray-800 mt-6 leading-relaxed">
              {description}
            </p>
          </header>

          {/* Contenido del artículo */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-800 prose-a:hover:text-blue-900 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-ol:text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Tags/Etiquetas */}
          <footer className="mt-12 pt-8 border-t border-gray-300">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Etiquetas:</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Navegación de artículos relacionados */}
            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-900 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
              </a>
            </div>
          </footer>
        </article>
      </Content>
    </>
  );
}
