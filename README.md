# CES 2026 - Sitio de Artículos Informativos

Aplicación Next.js con enfoque en SEO para cobertura del Consumer Electronics Show 2026. Proyecto desarrollado como prueba técnica de Frontend React + Next.js.

## Tabla de Contenidos

- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Estrategia de Rendering](#estrategia-de-rendering)
- [Consideraciones SEO](#consideraciones-seo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Implementados](#requisitos-implementados)

## Cómo Ejecutar el Proyecto

### Prerrequisitos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd ces2026
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Build de Producción

```bash
npm run build
npm run start
```

## Decisiones Técnicas

### Stack Tecnológico

- **Next.js 16** con App Router - Framework principal
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios

### App Router vs Pages Router

Se eligió **App Router** por las siguientes razones:

1. **Server Components por defecto**: Mejor performance y SEO out-of-the-box
2. **generateMetadata**: API moderna para metadata dinámica por página
3. **Layouts compartidos**: Estructura más limpia con layouts anidados
4. **Streaming y Suspense**: Mejor UX con carga progresiva
5. **Futuro de Next.js**: App Router es la arquitectura recomendada oficialmente

### Arquitectura de Componentes

```
src/
├── app/                      # App Router
│   ├── layout.tsx           # Layout raíz con Header/Footer
│   ├── page.tsx             # Página principal (SSG)
│   ├── articulos/
│   │   ├── page.tsx         # Listado de artículos (SSG)
│   │   └── [slug]/
│   │       ├── page.tsx     # Detalle de artículo (SSG)
│   │       └── not-found.tsx # Manejo 404
│   └── robots.ts            # Generación robots.txt
├── components/              # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Content.tsx
└── data/
    └── articles.ts          # Mock data de artículos
```

## Estrategia de Rendering

### Static Site Generation (SSG) - Elegido para todas las páginas

**Justificación:**

1. **SEO Máximo**: Todo el HTML se genera en build time, completamente indexable por bots
2. **Performance Óptima**: Páginas pre-renderizadas servidas desde CDN
3. **Core Web Vitals**: FCP, LCP y TTI excelentes
4. **Contenido Público**: Sin autenticación, ideal para SSG
5. **Escalabilidad**: Páginas estáticas manejan tráfico masivo sin problemas

### Implementación

**Página Principal (`/`):**
- SSG puro
- Se genera una vez en build time
- Muestra artículos destacados hardcoded

**Listado de Artículos (`/articulos`):**
- SSG puro
- Se genera en build time con todos los artículos
- Metadata estática optimizada

**Detalle de Artículo (`/articulos/[slug]`):**
- SSG con `generateStaticParams`
- Pre-genera todas las rutas de artículos en build time
- `generateMetadata` dinámico basado en contenido del artículo
- Fallback a 404 si el slug no existe

### Por qué NO ISR o SSR

**ISR (Incremental Static Regeneration):**
- No necesario porque el contenido del CES 2026 es histórico/estático
- Complejidad adicional innecesaria
- Si hubiera contenido actualizado frecuentemente, ISR sería ideal con `revalidate: 3600`

**SSR (Server-Side Rendering):**
- Overhead innecesario para contenido que no cambia
- Peor performance que SSG
- Útil solo para contenido altamente dinámico o personalizado

## Consideraciones SEO

### Metadata Dinámica

```typescript
// Uso de generateMetadata en App Router
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  return {
    title: `${article.title} - CES 2026`,
    description: article.description,
    openGraph: { ... },
    twitter: { ... },
    keywords: article.tags.join(", "),
  };
}
```

### HTML Semántico

- **Elementos correctos**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- **Jerarquía de encabezados**: H1 único por página, H2-H3 anidados correctamente
- **Landmarks ARIA**: `aria-label` en navegaciones, `aria-current` en breadcrumbs
- **Time elements**: `<time datetime>` para fechas legibles por máquinas

### Datos Estructurados (JSON-LD)

Implementado en cada página de artículo:

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "author": { "@type": "Person", "name": article.author },
  "datePublished": article.publishedDate,
  "publisher": { "@type": "Organization", "name": "CES 2026" },
  ...
};
```

**Beneficios:**
- Rich snippets en resultados de búsqueda
- Mejor comprensión del contenido por motores de búsqueda
- Posible aparición en Google Discover

### URLs Amigables

- `/articulos/ia-generativa-revoluciona-entretenimiento-ces-2026`
- Slugs descriptivos basados en el título
- Sin IDs numéricos en URL
- Estructura jerárquica clara

### Robots.txt

Implementado como archivo TypeScript dinámico:

```typescript
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', ... },
    sitemap: 'https://ces2026.com/sitemap.xml',
  };
}
```

### Manejo de 404

- Página personalizada `not-found.tsx`
- Mantiene layout consistente
- Links de navegación para recuperar al usuario
- Status HTTP 404 correcto

### Accesibilidad (A11y)

- **Navegación por teclado**: Todos los elementos interactivos accesibles
- **Contraste de colores**: WCAG AA compliant
- **Alt text preparado**: Estructura lista para imágenes
- **Screen readers**: Landmarks y ARIA labels

## Estructura del Proyecto

### Componentes Principales

**Header:**
- Navegación principal
- Branding CES 2026
- Links accesibles con estados hover
- Responsive

**Footer:**
- Información adicional
- Navegación secundaria
- Copyright dinámico
- Layout en grid responsive

**Content:**
- Wrapper reutilizable para contenido principal
- Mantiene consistencia de espaciado
- Elemento `<main>` semántico

### Gestión de Datos

Archivo centralizado `src/data/articles.ts`:

```typescript
export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  author: string;
  publishedDate: string;
  tags: string[];
}
```

**Helper functions:**
- `getAllArticles()`: Retorna todos los artículos
- `getArticleBySlug(slug)`: Busca artículo específico
- `getAllSlugs()`: Para `generateStaticParams`

## Requisitos Implementados

### Requisitos CLAVE ✅

- [x] Stack: Next.js + React + TypeScript
- [x] Página principal con listado de artículos
- [x] URLs amigables con slugs
- [x] SSG implementado
- [x] Completamente indexable
- [x] Página de detalle con h1, contenido, metadata dinámica
- [x] Renderizado en servidor
- [x] Metadata dinámica por página
- [x] Encabezados semánticos correctos
- [x] HTML semántico
- [x] Manejo de páginas 404
- [x] Estructura clara y escalable

### Requisitos PLUS ✅

- [x] `generateMetadata` en App Router
- [x] `robots.txt` implementado
- [x] Datos estructurados JSON-LD
- [x] Layout profesional (Header, Content, Footer)
- [x] 5+ artículos completos con contenido real sobre CES 2026
- [x] Breadcrumbs para navegación
- [x] Categorías y tags
- [x] Metadata Open Graph y Twitter Cards

### Performance

- Server Components por defecto
- Cero JavaScript innecesario en cliente
- CSS optimizado con Tailwind
- Estructura preparada para `next/image`
- Fuentes optimizadas con `next/font`

### SEO Score Esperado

- **Lighthouse SEO**: 100/100
- **Indexabilidad**: 100% (todo SSG)
- **Core Web Vitals**: Excelente (páginas estáticas)
- **Schema Markup**: Implementado
- **Mobile-Friendly**: Responsive completo

## Próximos Pasos (Mejoras Futuras)

1. **Imágenes reales**: Integrar `next/image` con imágenes optimizadas del CES 2026
2. **Sitemap XML**: Generar sitemap.xml dinámico
3. **Búsqueda**: Implementar búsqueda client-side o con Algolia
4. **Filtros por categoría**: Páginas `/articulos/categoria/[slug]`
5. **Paginación**: Si hay muchos artículos
6. **RSS Feed**: Para suscriptores
7. **Analytics**: Google Analytics 4 o Vercel Analytics
8. **Tests**: Unit tests con Jest, E2E con Playwright

## Tecnologías y Herramientas

- Next.js 16.1.1
- React 19
- TypeScript
- Tailwind CSS
- ESLint + Prettier
- Git

## Autor

Proyecto desarrollado como prueba técnica Frontend React + Next.js con enfoque en SEO.

## Licencia

Este es un proyecto de demostración técnica.
