import { Metadata } from "next";
import { notFound } from "next/navigation";
import Content from "@/components/Content";
import { getArticleBySlug } from "@/data/articles";
import { formatDate } from "@/utils";
import { articles } from "@/app/api/articles/route";

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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
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

  // Datos estructurados JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "datePublished": article.publishedDate,
    "dateModified": article.publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "CES 2026",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ces2026.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ces2026.com/${article.slug}`
    },
    "articleSection": article.category,
    "keywords": article.tags.join(", ")
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
                  {article.category}
                </li>
              </ol>
            </nav>

            {/* Categoría */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-50 rounded-full">
                {article.category}
              </span>
            </div>

            {/* Título principal - h1 para SEO */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta información del artículo */}
            <div className="flex flex-wrap items-center gap-4 text-gray-700 text-sm border-b border-gray-300 pb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>
                  Por <strong className="text-gray-900">{article.author}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time dateTime={article.publishedDate}>
                  {formatDate(article.publishedDate, 'long')}
                </time>
              </div>
            </div>

            {/* Descripción/Sumario */}
            <p className="text-xl text-gray-800 mt-6 leading-relaxed">
              {article.description}
            </p>
          </header>

          {/* Contenido del artículo */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-800 prose-a:hover:text-blue-900 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-ol:text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags/Etiquetas */}
          <footer className="mt-12 pt-8 border-t border-gray-300">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Etiquetas:</h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
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
