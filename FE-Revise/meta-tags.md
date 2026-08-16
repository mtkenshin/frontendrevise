# Meta Tags


Meta tags sit in the `<head>` of an HTML document to pass crucial data to search crawlers, social platforms, and web browsers.

---

---

## **1. Search Engine Optimization (SEO)**
Controls how search crawlers understand your content and display it in Search Engine Result Pages (SERPs).

```html
<title>Ultimate Guide to Modern Web Development</title>
<meta name="description" content="A complete walkthrough on building fast, scalable web apps using modern frameworks.">

```

## **2. Social Media Link Sharing**
Uses Open Graph (`og:`) and Twitter properties so messaging apps and social channels render custom visual cards when your link is pasted.

```html
<meta property="og:title" content="Ultimate Guide to Modern Web Development">
<meta property="og:description" content="Build fast, scalable web apps with this modern tutorial.">
<meta property="og:image" content="https://example.com/assets/preview.jpg">
<meta property="og:url" content="https://example.com/guide">
<meta name="twitter:card" content="summary_large_image">

```

## **3. Mobile Responsiveness**
Tells mobile browsers how to scale page dimensions to fit the device width properly.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

```

## **4. Browser & Indexing Directives**
Sets the character set to prevent encoding bugs and controls whether search engines index or follow page links.

```html
<!-- Character encoding for standard text rendering -->
<meta charset="UTF-8">

<!-- Prevents search crawlers from indexing private or staging pages -->
<meta name="robots" content="noindex, nofollow">

```

## **5. Verification & Security**
Confirms website ownership for domain console verification and enforces runtime security rules.

```html
<!-- Google Search Console domain ownership verification -->
<meta name="google-site-verification" content="your_unique_verification_code">

<!-- Security policy controlling external resource origins -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">

```