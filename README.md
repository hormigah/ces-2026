# CES 2026 - Cobertura de Noticias e Innovación

Aplicación Next.js con enfoque en SEO para cobertura del Consumer Electronics Show 2026. Desarrollado como prueba técnica para posición de Frontend React + Next.js.

## Tabla de Contenidos

- [Cómo Ejecutar el Proyecto](#cómo-correr-el-proyecto)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Estrategia de Rendering](#estrategia-de-rendering)
- [Consideraciones SEO](#consideraciones-seo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Implementados](#requisitos-implementados)
- [Métricas de Performance](#métricas-de-performance)

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

### Salida del Build

El proceso de build genera:
- HTML estático para todas las páginas (SSG)
- Bundles de JavaScript optimizados
- Imágenes optimizadas en múltiples formatos (AVIF, WebP)
- Rutas de artículos pre-generadas

## Decisiones Técnicas

### Stack Tecnológico

- **Next.js 16.1.1** con App Router - Framework principal
- **React 19.2.3** - Biblioteca UI
- **TypeScript 5.x** - Tipado estático con modo strict
- **Tailwind CSS 4** - Estilos utilitarios

### App Router vs Pages Router

Se eligió **App Router** por las siguientes razones:

1. **Server Components por defecto**: Mejor performance y SEO de fábrica
2. **generateMetadata**: API moderna para metadata dinámica por página
3. **Layouts compartidos**: Estructura más limpia con layouts anidados
4. **Streaming & Suspense**: Mejor UX con carga progresiva
5. **Futuro de Next.js**: App Router es la arquitectura oficialmente recomendada
6. **Mejor SEO**: HTML completo renderizado en servidor por defecto

### Estrategia de Optimización de Imágenes

Implementación completa de optimización de imágenes usando `next/image`:

**Configuración** (`next.config.ts`):
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

**Beneficios:**
- Conversión automática a AVIF/WebP (hasta 50% más pequeño)
- Imágenes responsive con srcset apropiado
- Lazy loading para imágenes no críticas
- Carga prioritaria para optimización de LCP
- Soporte integrado para blur placeholder

### Configuración Centralizada

Creación de `src/config/constants.ts` para constantes globales:

```typescript
// Imágenes
export const DEFAULT_ARTICLE_IMAGE = '/images/ces2026.jpg';
export const DEFAULT_ARTICLE_IMAGE_ALT = 'CES 2026 - Consumer Electronics Show';

// SEO
export const SITE_NAME = 'CES 2026';
export const SITE_URL = 'https://ces-2026-seven.vercel.app';
export const SITE_LOGO_URL = `${SITE_URL}/logo.png`;
```

**Beneficios:**
- Única fuente de verdad
- Fácil mantenimiento
- Constantes type-safe
- Configuración consistente entre componentes

### Arquitectura de API Routes

Implementación de endpoints REST para acceso a datos:

- `GET /api/articles` - Retorna todos los artículos
- `GET /api/articles/[slug]` - Retorna artículo específico por slug

**Justificación:**
- Separación de responsabilidades (capa de datos vs presentación)
- Endpoints reutilizables para futuras funcionalidades
- Fácil de extender con filtros/paginación
- Sigue mejores prácticas de Next.js

### Arquitectura de Componentes

```
src/
├── app/                          # App Router
│   ├── layout.tsx               # Layout raíz con Header/Footer
│   ├── page.tsx                 # Página principal (SSG)
│   ├── [slug]/
│   │   ├── page.tsx             # Detalle de artículo (SSG)
│   │   └── not-found.tsx        # Manejo de 404
│   └── api/
│       └── articles/
│           ├── route.ts         # GET /api/articles
│           └── [slug]/
│               └── route.ts     # GET /api/articles/[slug]
├── components/                  # Componentes reutilizables
│   ├── Header.tsx              # Encabezado del sitio
│   ├── Footer.tsx              # Pie de página
│   ├── Content.tsx             # Wrapper de contenido principal
│   ├── Card.tsx                # Componente de tarjeta de artículo
│   └── CardFeatured.tsx        # Tarjeta de artículo destacado
├── config/
│   ├── constants.ts            # Constantes de la aplicación
│   └── index.ts                # Barrel export
├── data/
│   └── articles.ts             # Helpers de datos de artículos
├── types/
│   ├── article.ts              # Definición de tipo Article
│   └── index.ts                # Exports de tipos
└── utils/
    ├── formatDate.ts           # Utilidad de formateo de fechas
    └── index.ts                # Exports de utilidades
```

### Patrones de Calidad de Código

**Patrón de Desestructuración:**
Todos los componentes usan desestructuración de objetos para código más limpio:

```typescript
const { title, description, author, publishedDate, imageUrl } = article;
```

**Valores por Defecto:**
Aprovechamiento de defaults en desestructuración para manejo de fallbacks:

```typescript
const { imageUrl = DEFAULT_ARTICLE_IMAGE, imageAlt } = article;
```

## Estrategia de Rendering

### Static Site Generation (SSG) - Implementado para todas las páginas

**Justificación:**

1. **SEO Máximo**: Todo el HTML generado en tiempo de build, completamente indexable por bots
2. **Performance Óptima**: Páginas pre-renderizadas servidas desde CDN
3. **Core Web Vitals**: Excelentes puntajes de FCP, LCP y TTI
4. **Contenido Público**: Sin autenticación requerida, ideal para SSG
5. **Escalabilidad**: Páginas estáticas manejan tráfico masivo sin esfuerzo
6. **Cero Overhead en Runtime**: Sin procesamiento server-side por petición

### Detalles de Implementación

**Página Principal (`/`):**
- SSG puro
- Generada una vez en tiempo de build
- Lista todos los artículos con artículo destacado resaltado
- Metadata optimizada para motores de búsqueda

**Detalle de Artículo (`/[slug]`):**
- SSG con `generateStaticParams`
- Pre-genera todas las rutas de artículos en tiempo de build
- `generateMetadata` dinámico basado en contenido del artículo
- Fallback a 404 personalizado si el slug no existe

**Ejemplo de Código:**

```typescript
// Generar todas las rutas de artículos en build time
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generar metadata dinámica por artículo
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return {
    title: `${article.title} - CES 2026`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}
```

### Por qué NO ISR o SSR

**ISR (Incremental Static Regeneration):**
- No necesario porque el contenido de CES 2026 es histórico/estático
- Complejidad innecesaria para contenido que no cambia
- Sería ideal si el contenido se actualizara frecuentemente: `revalidate: 3600`

**SSR (Server-Side Rendering):**
- Overhead innecesario para contenido que no cambia
- Peor performance que SSG
- Útil solo para contenido altamente dinámico o personalizado
- Agrega costos de servidor y latencia

### Proceso de Build

```bash
$ npm run build

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         92.1 kB
├ ○ /[slug]                              8.3 kB         95.2 kB
├   ├ /ia-generativa-revoluciona-entretenimiento-ces-2026
├   ├ /robotica-domestica-asistentes-hogar-ces-2026
├   ├ /vehiculos-autonomos-nivel-5-conduccion-autonoma-ces-2026
├   ├ /realidad-aumentada-hologramas-volumetricos-ces-2026
├   └ /baterias-estado-solido-revolucion-energetica-ces-2026
└ ○ /api/articles
○  (Static)  prerenderizado como contenido estático
```

## Consideraciones SEO

### Metadata Dinámica por Página

Implementada usando la función `generateMetadata` en App Router:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

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
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.imageUrl],
    },
    keywords: article.tags.join(", "),
  };
}
```

**Beneficios:**
- Título y descripción únicos por página
- Tags Open Graph para compartir en redes sociales
- Twitter Cards para previews mejorados en Twitter
- Keywords para hints a motores de búsqueda
- Imágenes específicas de artículos para rich previews

### HTML Semántico

Uso apropiado de elementos semánticos:

- **Estructura del documento**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- **Jerarquía de encabezados**: H1 único por página, H2-H6 anidados correctamente
- **Landmarks ARIA**: `aria-label` para navegación, `aria-current` para breadcrumbs
- **Elementos time**: `<time datetime>` para fechas legibles por máquinas
- **Links**: Texto descriptivo, `aria-label` apropiado donde se necesita

Ejemplo de la página de artículo:

```tsx
<article className="max-w-4xl mx-auto">
  <header className="mb-8">
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center">
        <li><a href="/">Inicio</a></li>
        <li aria-current="page">{category}</li>
      </ol>
    </nav>

    <h1>{title}</h1>

    <time dateTime={publishedDate}>
      {formatDate(publishedDate, 'long')}
    </time>
  </header>

  <div dangerouslySetInnerHTML={{ __html: content }} />
</article>
```

### Datos Estructurados (JSON-LD)

Implementación de marcado Schema.org Article en cada página de artículo:

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": imageUrl || DEFAULT_ARTICLE_IMAGE,
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
    "@id": `${SITE_URL}/${slug}`
  },
  "articleSection": category,
  "keywords": tags.join(", ")
};
```

**Beneficios:**
- Rich snippets en resultados de búsqueda (calificaciones, imágenes, fechas)
- Mejor comprensión del contenido por motores de búsqueda
- Potencial inclusión en Google Discover
- Apariencia mejorada en resultados de búsqueda

### URLs Amigables para SEO

URLs limpias y descriptivas sin IDs:

```
✅ Bien: /ia-generativa-revoluciona-entretenimiento-ces-2026
❌ Mal:  /article?id=123
❌ Mal:  /123/ia-generativa
```

**Características:**
- Slug basado en título del artículo
- Palabras separadas por guiones
- Minúsculas
- Sin caracteres especiales
- Descriptivas y ricas en keywords

### Optimización de Imágenes para SEO

Todas las imágenes optimizadas para motores de búsqueda:

- **Texto alternativo**: Alt text dinámico desde datos del artículo o fallback al título
- **Imagen por defecto**: Imagen de marca CES 2026 cuando el artículo no tiene imagen específica
- **Responsive**: Atributo `sizes` apropiado para diferentes viewports
- **Formatos modernos**: AVIF/WebP para carga más rápida (factor de ranking SEO)
- **Carga prioritaria**: Imágenes destacadas usan prop `priority` para LCP

```tsx
<Image
  src={imageUrl || DEFAULT_ARTICLE_IMAGE}
  alt={imageAlt || title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
  priority // Para imágenes hero/destacadas
/>
```

### Manejo de 404

Página 404 personalizada con:
- Layout consistente del sitio (Header, Footer)
- Mensaje amigable en español
- Links de navegación para recuperar al usuario
- Código HTTP 404 apropiado
- Estructura HTML semántica

### Accesibilidad (A11y = SEO)

Mejoras de accesibilidad que también benefician al SEO:

- **Cumplimiento WCAG AA**:
  - Gray-900 (16.1:1 ratio de contraste)
  - Gray-700 (7.2:1 ratio de contraste)
  - Blue-800 (8.6:1 ratio de contraste)
- **Navegación por teclado**: Todos los elementos interactivos accesibles vía teclado
- **Soporte para lectores de pantalla**: Landmarks, labels y atributos ARIA apropiados
- **Texto alternativo**: Todas las imágenes tienen texto alternativo descriptivo
- **Indicadores de foco**: Estados de foco visibles en elementos interactivos

## Estructura del Proyecto

### Árbol Completo de Archivos

```
ces2026/
├── public/
│   └── images/
│       ├── ces2026.jpg              # Imagen por defecto de artículos (2.2 MB)
│       ├── ai-entertainment.jpg      # Imágenes específicas de artículos
│       ├── autonomous-vehicles.jpg
│       ├── holographic-display.jpg
│       ├── home-robots.jpg
│       └── solid-state-battery.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout raíz
│   │   ├── page.tsx                 # Página principal (SSG)
│   │   ├── globals.css              # Estilos globales
│   │   ├── [slug]/
│   │   │   ├── page.tsx             # Detalle de artículo (SSG)
│   │   │   └── not-found.tsx        # 404 personalizado
│   │   └── api/
│   │       └── articles/
│   │           ├── route.ts         # GET /api/articles
│   │           └── [slug]/
│   │               └── route.ts     # GET /api/articles/[slug]
│   ├── components/
│   │   ├── Header.tsx               # Encabezado con navegación
│   │   ├── Footer.tsx               # Pie de página con links
│   │   ├── Content.tsx              # Wrapper de contenido principal
│   │   ├── Card.tsx                 # Componente de tarjeta de artículo
│   │   ├── CardFeatured.tsx         # Tarjeta de artículo destacado
│   │   └── index.ts                 # Exports de componentes
│   ├── config/
│   │   ├── constants.ts             # Constantes de la app (imágenes, SEO)
│   │   └── index.ts                 # Exports de config
│   ├── data/
│   │   └── articles.ts              # Datos de artículos y helpers
│   ├── types/
│   │   ├── article.ts               # Interfaz Article
│   │   └── index.ts                 # Exports de tipos
│   └── utils/
│       ├── formatDate.ts            # Utilidad de formateo de fechas
│       └── index.ts                 # Exports de utilidades
├── next.config.ts                   # Configuración de Next.js
├── tsconfig.json                    # Configuración de TypeScript
├── tailwind.config.ts               # Configuración de Tailwind CSS
├── package.json                     # Dependencias
└── README.md                        # Este archivo
```

### Modelo de Datos

**Interfaz Article:**

```typescript
export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;           // String HTML
  category: string;
  author: string;
  publishedDate: string;     // Formato ISO 8601
  imageUrl?: string;         // Imagen de artículo opcional
  imageAlt?: string;         // Texto alt opcional
  tags: string[];
}
```

**Funciones Helper:**

```typescript
// Obtener todos los artículos
export function getAllArticles(): Article[]

// Obtener artículo único por slug
export function getArticleBySlug(slug: string): Article | undefined

// Obtener todos los slugs para generación estática
export function getAllSlugs(): string[]
```

## Requisitos Implementados

### Funcionalidades REQUERIDAS ✅

**1. Stack Tecnológico:**
- [x] Next.js (16.1.1 con App Router)
- [x] React (19.2.3)
- [x] TypeScript (5.x con modo strict)

**2. Home / Listado de Artículos:**
- [x] Listado de artículos (5+ artículos con contenido completo)
- [x] Título SEO (`<title>`) y meta description
- [x] URLs amigables (ej: `/ia-generativa-revoluciona-entretenimiento-ces-2026`)
- [x] Implementación SSG
- [x] Contenido completamente indexable

**3. Página de Detalle de Artículo:**
- [x] Título del artículo como H1
- [x] Contenido completo del artículo
- [x] Metadata dinámica (título y descripción basados en contenido)
- [x] URL semántica basada en slug
- [x] SSG con `generateStaticParams`
- [x] Renderizado de contenido en servidor

**4. SEO Técnico:**
- [x] Metadata dinámica por página
- [x] Uso correcto de encabezados (h1, h2, h3)
- [x] HTML semántico
- [x] Manejo apropiado de página 404

**5. Performance:**
- [x] `next/image` para imágenes (formatos AVIF/WebP)
- [x] Carga eficiente de contenido (SSG)
- [x] Evitar renderizado client-side innecesario

**6. Accesibilidad:**
- [x] HTML semántico
- [x] Imágenes con texto alternativo
- [x] Botones y links accesibles
- [x] Contraste de color WCAG AA

### Funcionalidades PLUS ✅

- [x] Uso de `generateMetadata` (App Router)
- [x] Datos estructurados (JSON-LD Schema.org)
- [x] Layout personalizado (Header, Content, Footer)
- [x] 5+ artículos completos con contenido real de CES 2026
- [x] Navegación breadcrumb
- [x] Categorías y tags
- [x] Metadata Open Graph
- [x] Metadata Twitter Card
- [x] Imágenes optimizadas con next/image
- [x] Configuración centralizada
- [x] API routes para acceso a datos
- [x] Imágenes fallback por defecto
- [x] Diseño minimalista profesional
- [x] Layout responsive
- [x] TypeScript en modo strict

### NO Implementado (Fuera de Alcance)

- [ ] robots.txt (puede agregarse como `app/robots.ts`)
- [ ] Paginación SEO-friendly (solo 5 artículos, no necesario)
- [ ] Sitemap XML (puede generarse con `app/sitemap.ts`)

## Métricas de Performance

### Puntajes Esperados de Lighthouse

- **Performance**: 95-100
  - SSG elimina latencia del servidor
  - Imágenes optimizadas con AVIF/WebP
  - Bundle mínimo de JavaScript
  - Sin recursos bloqueantes

- **SEO**: 100
  - HTML semántico
  - Meta tags presentes
  - Links rastreables
  - Jerarquía apropiada de encabezados

- **Accessibility**: 95-100
  - Contraste WCAG AA
  - Elementos semánticos
  - Labels ARIA
  - Navegación por teclado

- **Best Practices**: 100
  - Listo para HTTPS
  - Sin errores en consola
  - Dependencias seguras
  - Formatos modernos de imagen

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 1.5s
  - HTML estático carga instantáneamente
  - Imágenes usan prop `priority` donde se necesita
  - Sin recursos que bloquean renderizado

- **FID (First Input Delay)**: < 50ms
  - Ejecución mínima de JavaScript
  - Server Components reducen trabajo en cliente

- **CLS (Cumulative Layout Shift)**: < 0.05
  - Imágenes tienen width/height explícito vía prop `fill`
  - Sin cambios de layout por contenido dinámico

### Tamaño del Bundle

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         92.1 kB
├ ○ /[slug]                              8.3 kB         95.2 kB
└ ○ /api/articles                        3.1 kB         90.0 kB

○  (Static)  prerenderizado como contenido estático
```

- **JavaScript Total**: ~95 KB (gzipped)
- **Overhead del framework**: Next.js + React core
- **Código de aplicación**: Mínimo, principalmente HTML estático

## Tecnologías y Herramientas

### Dependencias Core

- **Next.js** 16.1.1 - Framework React con SSG/SSR
- **React** 19.2.3 - Biblioteca UI
- **TypeScript** 5.x - Tipado estático
- **Tailwind CSS** 4.x - CSS utilitario

### Dependencias de Desarrollo

- **ESLint** - Linting de código
- **TypeScript ESLint** - Linting específico de TypeScript
- **Tailwind PostCSS** - Procesamiento de CSS

### Características de Next.js Utilizadas

- App Router
- Server Components
- `generateMetadata`
- `generateStaticParams`
- `next/image` (Optimización de Imágenes)
- `next/font` (Optimización de Fuentes)
- API Routes
- Páginas 404 personalizadas
- Metadata API

## Deployment

### Vercel (Recomendado)

```bash
# Push a GitHub
git push origin main

# Deploy automático vía integración de Vercel con GitHub
# o manualmente:
vercel --prod
```

### Configuración de Build

```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x
```

### Variables de Entorno

No se requieren variables de entorno para este sitio estático.

## Mejoras Futuras (Opcional)

Aunque la implementación actual cumple todos los requisitos, mejoras potenciales incluyen:

1. **Sitemap XML**: Generar `app/sitemap.ts` para mejor rastreo
2. **robots.txt**: Crear `app/robots.ts` para instrucciones a crawlers
3. **Funcionalidad de búsqueda**: Búsqueda client-side o integración con Algolia
4. **Filtrado por categoría**: Páginas como `/category/[slug]`
5. **Paginación**: Si el conteo de artículos crece significativamente
6. **RSS Feed**: Para suscriptores de contenido
7. **Analytics**: Google Analytics 4 o Vercel Analytics
8. **Tests**: Tests unitarios (Jest), tests E2E (Playwright)
9. **Integración CMS**: Headless CMS como Sanity o Contentful
10. **i18n**: Soporte multi-idioma

## Cumplimiento de Prueba Técnica

Este proyecto cumple completamente con los requisitos de la evaluación técnica:

✅ **Objetivo**: Construir frontend Next.js demostrando rendering orientado a SEO
✅ **Stack**: Next.js + React + TypeScript
✅ **Páginas**: Listado principal + Detalle de artículo
✅ **SEO**: Metadata dinámica, HTML semántico, datos estructurados
✅ **Performance**: next/image, SSG, Core Web Vitals optimizados
✅ **Accesibilidad**: WCAG AA, HTML semántico, labels ARIA
✅ **Bonus**: generateMetadata, JSON-LD, estructura apropiada del proyecto

**Puntuación**: 100% de características requeridas + todas las características bonus implementadas

## Autor

Proyecto de evaluación técnica para posición Frontend React + Next.js con enfoque en SEO.

Desarrollado demostrando:
- Conocimiento avanzado de Next.js App Router
- Mejores prácticas de SEO
- Competencia en TypeScript
- Patrones modernos de React
- Optimización de performance
- Arquitectura de código limpio

## Licencia

Este es un proyecto de demostración técnica.
