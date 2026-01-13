import { ArticlesLoader, Card, CardFeatured, Content } from '@/components';
import { getArticlesFromAPI } from '@/utils';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

export default async function Home() {
  const articles = await getArticlesFromAPI();
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <Content>
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de la página */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Últimas novedades del CES 2026
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Cobertura completa de las innovaciones más impactantes del evento tecnológico más
            importante del año. Descubre las tendencias que definirán el futuro.
          </p>
        </header>

        {/* Artículo destacado */}
        {featuredArticle && (
          <section className="mb-8">
            <CardFeatured article={featuredArticle} />
          </section>
        )}

        {/* Listado de artículos */}
        <section className="space-y-4">
          {remainingArticles.map((article) => (
            <Card key={article.id} article={article} />
          ))}
        </section>

        {/* Componente para cargar más artículos */}
        <ArticlesLoader />

        {/* Mensaje si no hay artículos */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg">No hay artículos disponibles en este momento.</p>
          </div>
        )}

        {/* About CES Section */}
        <section className="border-gray-300 pt-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre el CES 2026</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              El Consumer Electronics Show 2026 continúa siendo el evento tecnológico más importante
              del mundo, reuniendo a líderes de la industria, innovadores y visionarios para
              presentar las tecnologías que transformarán nuestras vidas.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Este año, el evento destaca especialmente los avances en inteligencia artificial,
              robótica doméstica, vehículos autónomos y nuevas formas de interacción digital que
              prometen revolucionar la forma en que trabajamos, nos comunicamos y vivimos.
            </p>
          </div>
        </section>
      </div>
    </Content>
  );
}
