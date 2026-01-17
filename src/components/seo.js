/**
 * Enhanced SEO component with structured data (JSON-LD), 
 * canonical URLs, Open Graph, and Twitter Cards
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

function Seo({ 
  description, 
  title, 
  children,
  // Article-specific props
  article = false,
  publishedTime,
  modifiedTime,
  tags = [],
  // Page-specific props
  pathname = "",
  image,
  noindex = false,
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            keywords
            image
            social {
              twitter
              linkedin
              github
            }
          }
        }
      }
    `
  )

  const { siteMetadata } = site
  const metaDescription = description || siteMetadata.description
  const defaultTitle = siteMetadata?.title
  const siteUrl = siteMetadata?.siteUrl
  const canonical = pathname ? `${siteUrl}${pathname}` : siteUrl
  const ogImage = image 
    ? `${siteUrl}${image}` 
    : `${siteUrl}${siteMetadata?.image || '/og-image.png'}`
  const keywords = siteMetadata?.keywords?.join(', ') || ''

  // Build JSON-LD structured data
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    }

    if (article) {
      // Article/BlogPosting schema for blog posts
      return {
        ...baseData,
        "@type": "BlogPosting",
        "headline": title,
        "description": metaDescription,
        "image": ogImage,
        "url": canonical,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "author": {
          "@type": "Person",
          "name": siteMetadata.author,
          "url": siteUrl,
          "sameAs": [
            siteMetadata.social?.linkedin,
            siteMetadata.social?.github,
          ].filter(Boolean),
        },
        "publisher": {
          "@type": "Person",
          "name": siteMetadata.author,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.png`,
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonical,
        },
        "keywords": tags.join(', '),
      }
    }

    // WebSite/WebPage schema for other pages
    return {
      ...baseData,
      "@type": "WebSite",
      "name": defaultTitle,
      "description": metaDescription,
      "url": siteUrl,
      "author": {
        "@type": "Person",
        "name": siteMetadata.author,
        "url": siteUrl,
        "sameAs": [
          siteMetadata.social?.linkedin,
          siteMetadata.social?.github,
        ].filter(Boolean),
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/blog?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    }
  }

  // Person schema for author info (shows in Knowledge Panel)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteMetadata.author,
    "url": siteUrl,
    "jobTitle": "Software Engineer",
    "sameAs": [
      siteMetadata.social?.linkedin,
      siteMetadata.social?.github,
      siteMetadata.social?.twitter ? `https://twitter.com/${siteMetadata.social.twitter.replace('@', '')}` : null,
    ].filter(Boolean),
  }

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={siteMetadata.author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article-specific Open Graph tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && siteMetadata.author && (
        <meta property="article:author" content={siteMetadata.author} />
      )}
      {article && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.social?.twitter || ""} />
      <meta name="twitter:creator" content={siteMetadata.social?.twitter || ""} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* RSS Feed */}
      <link 
        rel="alternate" 
        type="application/rss+xml" 
        title={`${defaultTitle} - RSS Feed`}
        href={`${siteUrl}/rss.xml`} 
      />
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      
      {children}
    </>
  )
}

export default Seo
