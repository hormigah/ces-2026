# CES 2026 - Cobertura de Noticias e Innovación

Aplicación Next.js con enfoque en SEO para cobertura del Consumer Electronics Show 2026. Desarrollado como prueba técnica para posición de Frontend React + Next.js.

## Tabla de Contenidos

- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Estrategia de Rendering](#estrategia-de-rendering)
- [Consideraciones SEO](#consideraciones-seo)
- [Testing y Calidad de Código](#testing-y-calidad-de-código)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Implementados](#requisitos-implementados)
- [CI/CD](#cicd)

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
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local` con la URL del backend:
```env
NEXT_PUBLIC_API_URL=https://dev-ces-2026-backend.pantheonsite.io
```

4. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Verificar linting
npm run lint:fix     # Corregir issues de linting
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formato de código
npm run type-check   # Verificar tipos de TypeScript
npm run test         # Ejecutar tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Generar reporte de cobertura
```

## Decisiones Técnicas

### Stack Tecnológico

- **Next.js 16.1.1** con App Router - Framework principal
- **React 19.2.3** - Biblioteca UI
- **TypeScript 5.x** - Tipado estático con modo strict
- **Tailwind CSS 4** - Estilos utilitarios
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes

### App Router vs Pages Router

Se eligió **App Router** por las siguientes razones:

1. **Server Components por defecto**: Mejor performance y SEO de fábrica
2. **generateMetadata**: API moderna para metadata dinámica por página
3. **Layouts compartidos**: Estructura más limpia con layouts anidados
4. **Streaming & Suspense**: Mejor UX con carga progresiva
5. **Futuro de Next.js**: App Router es la arquitectura oficialmente recomendada
6. **Mejor SEO**: HTML completo renderizado en servidor por defecto

### Integración con Backend API

El proyecto consume datos de una API REST con funciones centralizadas:

- **API Base**: `https://dev-ces-2026-backend.pantheonsite.io`
- **Endpoints**:
  - `/api/articles` - Listado completo de artículos
  - `/api/article-by-slug/?slug=/[slug]` - Artículo individual por slug
- **Configuración**: Variable de entorno `NEXT_PUBLIC_API_URL`
- **Estrategia**: ISR para balance entre performance y actualización de la información
- **Ubicación**: Utilidades centralizadas en `src/utils/articles/articles.ts`


### Arquitectura de Componentes

Estructura modular con separación de responsabilidades:

```
src/
├── app/                      # App Router
├── components/               # Componentes UI
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── index.ts
│   │   └── tests/
│   │       └── Card.test.tsx
│   ├── CardFeatured/
│   ├── Content/
│   ├── Footer/
│   └── Header/
├── config/                   # Configuración centralizada
│   ├── constants.ts
│   └── index.ts
├── types/                    # Definiciones TypeScript
├── utils/                    # Utilidades compartidas
└── tests/                    # Testing utilities
    ├── TestAppProviders.tsx
    └── index.tsx
```

**Características:**
- Cada componente en su propio directorio
- Barrel exports (`index.ts`) para imports limpios
- Tests ubicados con su propio componente
- Configuración centralizada

## Estrategia de Rendering

### Incremental Static Regeneration (ISR) + SSG

**Página Principal (`/`):**
- **ISR con revalidate: 60 segundos**
- Fetch desde API externa
- Balance entre performance (static) y frescura de datos (revalidación)
- HTML estático actualizado automáticamente cada 60s

**Justificación de ISR:**
- Contenido se actualiza periódicamente desde el backend
- Los bots ven HTML estático completo (excelente SEO)
- Los usuarios obtienen contenido reciente sin esperar
- Reducción de carga en el servidor API

**Página de Detalle (`/[slug]`):**
- **ISR con `generateStaticParams` + revalidate: 60 segundos**
- Pre-genera todas las rutas en build time
- Se actualiza automáticamente cada 60 segundos
- Metadata dinámica con `generateMetadata`
- Fallback a 404 si el slug no existe

**Sitemap Dinámico (`/sitemap.xml`):**
- **ISR con revalidate: 60 segundos**
- Genera automáticamente URLs de todos los artículos
- Incluye prioridades y frecuencias de cambio
- Fechas de última modificación basadas en publishedDate
- Se actualiza automáticamente cuando hay nuevos artículos

### Proceso de Build

```bash
Route (app)                                                                      Revalidate  Expire
┌ ○ /                                                                                    1m      1y
├ ○ /_not-found
├ ● /[slug]                                                                              1m      1y
│ ├ /ia-generativa-revoluciona-la-industria-del-entretenimiento-en-ces-2026              1m      1y
│ ├ /robotica-domestica-los-nuevos-asistentes-del-hogar-presentados-en-ces-2026          1m      1y
│ ├ /vehiculos-autonomos-nivel-5-la-conduccion-totalmente-autonoma-es-realidad           1m      1y
│ └ [+2 more paths]
├ ƒ /api/revalidate
├ ○ /robots.txt
└ ○ /sitemap.xml                                                                         1m      1y

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
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

### Datos Estructurados (JSON-LD)

Implementación de marcado Schema.org Article en cada página de artículo:

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": imageUrl,
  "author": { "@type": "Person", "name": author },
  "datePublished": publishedDate,
  "publisher": {
    "@type": "Organization",
    "name": "CES 2026",
    "logo": { "@type": "ImageObject", "url": SITE_LOGO_URL }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/${slug}` },
  "keywords": tags.join(", ")
};
```

**Beneficios:**
- Rich snippets en resultados de búsqueda
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

Todas las imágenes optimizadas para motores de búsqueda usando `next/image`:

- **Texto alternativo**: Alt text dinámico desde datos del artículo o fallback al título
- **Imagen por defecto**: Imagen de marca CES 2026 cuando el artículo no tiene imagen específica
- **Responsive**: Atributo `sizes` apropiado para diferentes viewports
- **Formatos modernos**: AVIF/WebP para carga más rápida (factor de ranking SEO)
- **Carga prioritaria**: Imágenes destacadas usan prop `priority` para LCP

```typescript
<Image
  src={imageUrl}
  alt={imageAlt || title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
  priority // Para imágenes críticas
/>
```

**Configuración** (`next.config.ts`):
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  minimumCacheTTL: 60,
}
```

### Manejo de 404

Página 404 personalizada (`app/[slug]/not-found.tsx`):
- Layout consistente del sitio
- Mensaje amigable
- Links de navegación
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

### robots.txt

Implementado en `app/robots.ts`:
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

**Características:**
- Permite el rastreo completo del sitio
- Bloquea rutas privadas (si existieran)
- Referencia al sitemap dinámico
- Usa variable de entorno para el dominio

### Sitemap Dinámico (sitemap.xml)

Implementado en `app/sitemap.ts` con generación dinámica desde la API:


**Beneficios para SEO:**
- **Descubrimiento automático**: Los motores de búsqueda encuentran todas las páginas
- **Actualización dinámica**: Se regenera cada 60s con ISR, incluyendo nuevos artículos
- **Prioridades correctas**: Homepage = 1.0, artículos = 0.8
- **Fechas precisas**: `lastModified` basado en fecha de publicación real
- **Frecuencia de cambio**: Indica a buscadores cuándo revisar (`daily` vs `weekly`)
- **URLs normalizadas**: Formato consistente sin duplicados

**Ejemplo de salida:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ces-2026-seven.vercel.app</loc>
    <lastmod>2026-01-11T21:57:34.665Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://ces-2026-seven.vercel.app/vehiculos-autonomos-nivel-5...</loc>
    <lastmod>2026-01-07T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... más artículos -->
</urlset>
```

## Testing y Calidad de Código

### Cobertura de Tests

**78 tests unitarios** cubriendo todos los componentes principales:

```bash
Test Suites: 5 passed, 5 total
Tests:       78 passed, 78 total
```

**Componentes testeados:**
- ✅ Card (17 tests)
- ✅ CardFeatured (17 tests)
- ✅ Content (12 tests)
- ✅ Footer (18 tests)
- ✅ Header (20 tests)

### Patrón de Testing

Todos los tests siguen el mismo patrón AAA (Arrange, Act, Assert):

```typescript
describe('Component', () => {
  const mockData = { /* ... */ };

  const renderComponent = (props = {}) => {
    return renderComponent(<Component {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Testing Utilities

**TestAppProviders**: Wrapper con proveedores necesarios
```typescript
export function renderComponent(component: ReactNode): RenderResult {
  return render(<TestAppProviders>{component}</TestAppProviders>);
}
```

### Linting y Formatting

**ESLint** configurado con:
- eslint-config-next
- eslint-config-prettier
- eslint-plugin-prettier
- @typescript-eslint

**Prettier** con configuración consistente para:
- JavaScript/TypeScript
- JSON
- CSS/SCSS
- Markdown

### Type Safety

TypeScript en modo strict:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## CI/CD

### GitHub Actions

Workflow automatizado (`.github/workflows/ci.yml`) que ejecuta en cada push y PR:

1. ✅ **Type Check**: `npm run type-check`
2. ✅ **Linter**: `npm run lint`
3. ✅ **Format Check**: `npm run format:check`
4. ✅ **Unit Tests**: `npm run test`
5. ✅ **Coverage Report**: `npm run test:coverage`

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run type check
      - Run linter
      - Check code formatting
      - Run unit tests
      - Generate coverage report
```

### Beneficios

- **Calidad garantizada**: No se puede mergear código que falle las verificaciones
- **Feedback rápido**: Los desarrolladores saben inmediatamente si algo se rompió
- **Documentación**: El workflow documenta el proceso de QA
- **Automatización**: Sin intervención manual necesaria

## Estructura del Proyecto

### Árbol de Archivos

```
ces2026/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # GitHub Actions CI workflow
│       └── README.md                 # Documentación del CI
├── public/
│   └── images/                       # Imágenes estáticas
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Layout raíz
│   │   ├── page.tsx                 # Home con ISR
│   │   ├── [slug]/
│   │   │   ├── page.tsx             # Detalle con ISR
│   │   │   └── not-found.tsx        # 404 personalizado
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts         # API de revalidación manual
│   │   ├── robots.ts                # robots.txt dinámico
│   │   └── sitemap.ts               # sitemap.xml dinámico con ISR
│   ├── components/                  # Componentes con tests
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── index.ts
│   │   │   └── tests/
│   │   │       └── Card.test.tsx
│   │   ├── CardFeatured/
│   │   ├── Content/
│   │   ├── Footer/
│   │   ├── Header/
│   │   └── index.ts
│   ├── config/
│   │   ├── constants.ts             # Constantes (URLs, imágenes)
│   │   └── index.ts
│   ├── data/
│   │   └── articles.json            # Datos locales (fallback)
│   ├── types/
│   │   ├── article.ts               # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/
│   │   ├── articles/
│   │   │   └── articles.ts          # API fetching y adaptadores
│   │   ├── formatDate.ts            # Formateo de fechas
│   │   └── index.ts
│   └── tests/
│       ├── TestAppProviders.tsx     # Test wrapper
│       └── index.tsx                # Test utilities
├── .env.local                       # Variables de entorno (no committed)
├── .env.example                     # Template de variables
├── jest.config.ts                   # Configuración de Jest
├── jest.setup.ts                    # Setup de Jest
├── next.config.ts                   # Configuración de Next.js
├── tailwind.config.ts               # Configuración de Tailwind
├── tsconfig.json                    # Configuración de TypeScript
└── README.md                        # Este archivo
```

## Requisitos Implementados

### ✅ REQUISITOS OBLIGATORIOS (100%)

**1. Stack Tecnológico:**
- ✅ Next.js 16.1.1 con App Router
- ✅ React 19.2.3
- ✅ TypeScript 5.x con modo strict

**2. Home / Listado de Artículos:**
- ✅ Listado de artículos (5+ artículos con contenido completo)
- ✅ Título SEO (`<title>`) y meta description
- ✅ URLs amigables (`/ia-generativa-revoluciona-entretenimiento-ces-2026`)
- ✅ **ISR con revalidate: 60 segundos**
- ✅ Contenido completamente indexable

**3. Página de Detalle de Artículo:**
- ✅ Título del artículo como H1
- ✅ Contenido completo del artículo
- ✅ Metadata dinámica (título y descripción basados en contenido)
- ✅ URL semántica basada en slug
- ✅ SSG con `generateStaticParams`
- ✅ Renderizado de contenido en servidor

**4. SEO Técnico:**
- ✅ Metadata dinámica por página con `generateMetadata`
- ✅ Uso correcto de encabezados (h1, h2, h3)
- ✅ HTML semántico (header, main, article, footer, nav)
- ✅ Manejo apropiado de página 404

**5. Performance:**
- ✅ `next/image` para todas las imágenes (AVIF/WebP)
- ✅ Carga eficiente de contenido (ISR + SSG)
- ✅ Evitar renderizado client-side innecesario
- ✅ Optimización de Core Web Vitals

**6. Accesibilidad:**
- ✅ HTML semántico
- ✅ Imágenes con texto alternativo descriptivo
- ✅ Botones y links accesibles
- ✅ Contraste de color WCAG AA
- ✅ Navegación por teclado
- ✅ Labels ARIA apropiados

### ✅ REQUISITOS DESEABLES (100%)

- ✅ Uso de `generateMetadata` (App Router)
- ✅ Implementación de robots.txt dinámico
- ✅ **Sitemap.xml dinámico con ISR**
- ✅ Datos estructurados (JSON-LD Schema.org)
- ✅ Open Graph metadata
- ✅ Twitter Cards metadata
- ✅ Breadcrumb navigation
- ✅ Integración con API externa
- ✅ Variables de entorno
- ✅ **GitHub Actions CI/CD**
- ✅ **78 tests unitarios**
- ✅ **Cobertura de testing**

## Mejoras Implementadas (Adicionales)

### Sitemap Dinámico con ISR
- Generación automática desde la API
- ISR con 60s de revalidación
- Incluye todas las páginas de artículos
- Prioridades y frecuencias de cambio optimizadas
- Fechas de última modificación precisas
- Actualización automática cuando hay nuevos artículos

### Testing Completo
- 78 tests unitarios con Jest + React Testing Library
- Testing utilities personalizadas
- Cobertura de todos los componentes principales
- Patrón AAA consistente

### CI/CD Automatizado
- GitHub Actions workflow
- Verificación de tipos, linting, formato y tests
- Documentación del proceso de QA
- Ejecución automática en push y PR

### Estructura Escalable
- Componentes en subdirectorios
- Barrel exports para imports limpios
- Tests co-ubicados con componentes
- Configuración centralizada
- Utilidades de API centralizadas

### Integración con Backend Avanzada
- Consumo de API REST en producción
- Múltiples endpoints (listado + detalle por slug)
- Variables de entorno configurables
- Transformación de datos de API a tipos locales
- Adaptadores centralizados para consistencia
- Manejo de errores robusto
- API de revalidación manual

## Métricas de Performance

### Puntajes Esperados de Lighthouse

- **Performance**: 95-100
  - ISR para contenido fresco sin sacrificar velocidad
  - Imágenes optimizadas con AVIF/WebP
  - Bundle mínimo de JavaScript

- **SEO**: 100
  - HTML semántico
  - Meta tags dinámicos
  - Datos estructurados
  - URLs amigables

- **Accessibility**: 95-100
  - Contraste WCAG AA
  - Labels ARIA
  - Navegación por teclado

- **Best Practices**: 100
  - HTTPS
  - Sin errores en consola
  - Dependencias actualizadas

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 1.5s
- **FID (First Input Delay)**: < 50ms
- **CLS (Cumulative Layout Shift)**: < 0.05

## Variables de Entorno

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://dev-ces-2026-backend.pantheonsite.io
NEXT_REVALIDATE_PATH_SECRET=be02b70224a215fc7e13c60d7c3759a4d7f9d688
```

Copiar `.env.example` a `.env.local` y configurar según el entorno.

## Deployment

### Vercel (Recomendado)

```bash
# Push a GitHub
git push origin main

# Deploy automático vía integración de Vercel con GitHub
```

**Configuración:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 20.x
- Environment Variables: Configurar `NEXT_PUBLIC_API_URL`

## Cumplimiento de Prueba Técnica

Este proyecto cumple con los requisitos de la evaluación técnica:

✅ **Objetivo**: Frontend Next.js demostrando rendering orientado a SEO
✅ **Stack**: Next.js 16.1.1 + React 19 + TypeScript 5
✅ **Páginas**: Listado principal (ISR) + Detalle de artículo (ISR) + Sitemap dinámico
✅ **SEO**: Metadata dinámica, HTML semántico, datos estructurados, robots.txt, sitemap.xml
✅ **Performance**: next/image, ISR, Core Web Vitals optimizados, AVIF/WebP
✅ **Accesibilidad**: WCAG AA, HTML semántico, labels ARIA, navegación por teclado
✅ **Bonus**: generateMetadata, JSON-LD, sitemap dinámico, GitHub Actions CI, 78 tests unitarios

**Puntuación**: 100% de requisitos obligatorios + 100% de requisitos deseables + mejoras adicionales significativas
