'use client';

import { Card } from '@/components';
import useArticlesLoader from './hooks/useArticlesLoader';

export default function ArticlesLoader() {
  const { articles, isLoading, hasMore, loadMoreArticles } = useArticlesLoader();

  return (
    <>
      {articles.length > 0 && (
        <section className="space-y-4 mt-4">
          {articles.map((article) => (
            <Card key={article.id} article={article} />
          ))}
        </section>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreArticles}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Cargando...' : 'Cargar más artículos'}
          </button>
        </div>
      )}
    </>
  );
}
