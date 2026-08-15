# Browser Mechanics & Performance Optimization - Revision Guide

This guide covers core browser architecture, rendering pipelines, Core Web Vitals, and optimization strategies required for senior and lead frontend interviews.

---

## 1. Critical Rendering Path & Engine Architecture

### The Rendering Pipeline

Understanding how the browser transforms HTML, CSS, and JS into pixels on screen is fundamental for diagnosing performance bottlenecks.

```
HTML ---> DOM Tree ---\
                       +---> Render Tree ---> Layout (Reflow) ---> Paint ---> Composite
CSS  ---> CSSOM Tree -/

```

### Key Stages

* **DOM Construction:** Parsing HTML tokens, creating nodes, and constructing the DOM tree. Parsing is incremental and can be blocked by synchronous `<script>` tags.
* **CSSOM Construction:** Parsing CSS rules into the CSSOM tree. CSS is render-blocking because the browser cannot calculate geometry without complete CSS rules.
* **Render Tree:** Combining DOM and CSSOM trees, filtering out hidden nodes (e.g., `display: none` elements and `<head>`).
* **Layout (Reflow):** Calculating exact geometric positions and dimensions of each visible render node based on viewport size.
* **Paint:** Converting render nodes into actual pixels on multiple layers (text, colors, borders, shadows).
* **Compositing:** Layer blending and thread orchestration. Drawing layers onto screen surfaces using GPU execution.

### Reflow vs. Repaint vs. Compositor-Only

* **Reflow (Layout):** Triggered by properties affecting geometry (`width`, `height`, `margin`, `fontSize`, `top`/`left`). Triggers Layout $\rightarrow$ Paint $\rightarrow$ Composite.
* **Repaint:** Triggered by visual appearance changes that don't affect geometry (`color`, `background-color`, `visibility`). Triggers Paint $\rightarrow$ Composite.
* **Compositor-Only:** Triggered by hardware-accelerated GPU properties (`transform`, `opacity`, `filter`). Bypasses Layout and Paint on main thread, running directly on the GPU thread.

---

## 2. Core Web Vitals (CWV) & Performance Metrics

| Metric | Target | Focus Area | Common Bottlenecks & Fixes |
| --- | --- | --- | --- |
| **LCP** (Largest Contentful Paint) | $< 2.5\text{s}$ | Loading Performance | Slow server response times, render-blocking JS/CSS, unoptimized main images. Fix: Preload hero images (`fetchpriority="high"`), inline critical CSS, use modern image formats (WebP/AVIF). |
| **INP** (Interaction to Next Paint) | $< 200\text{ms}$ | Responsiveness / Interactivity | Long main-thread JS tasks ($> 50\text{ms}$) blocking frame updates. Fix: Break up long tasks using `scheduler.yield()` or `setTimeout`, yield to main thread, defer non-critical JS. |
| **CLS** (Cumulative Layout Shift) | $< 0.1$ | Visual Stability | Images/IFrames without explicit dimensions, dynamic content injection without reserved space, web fonts causing FOIT/FOUT. Fix: Always reserve space (`aspect-ratio`, explicit `width`/`height`), use `font-display: swap` with metric overriding. |

---

## 3. Asset & Bundle Optimization

### JavaScript Delivery Strategies

* **`async` Script Loading:** Downloads in parallel with HTML parsing, executes immediately upon arrival (pauses HTML parser during execution). Best for independent scripts (e.g., analytics).
* **`defer` Script Loading:** Downloads in parallel with HTML parsing, executes in DOM order after HTML parsing is complete. Best for application bundles and scripts dependent on full DOM tree.
* **Code-Splitting & Dynamic Imports:** Splitting monolithic JS bundles into dynamic chunks via `import()` boundaries, routing-based lazy loading, and vendor chunk separation.
* **Tree-Shaking:** Static AST analysis removing dead/unused code paths. Requires ES Module static import/export syntax and `sideEffects: false` declarations in `package.json`.

### Resource Hints & Preloading

* `<link rel="dns-prefetch" href="...">`: Resolves IP for external domains early.
* `<link rel="preconnect" href="...">`: Handles DNS lookup, TCP handshake, and TLS negotiation.
* `<link rel="preload" href="..." as="...">`: Forces browser to fetch high-priority resources needed in current route before discovery.
* `<link rel="prefetch" href="...">`: Low-priority fetch for resources expected on subsequent page navigations.

---

## 4. Browser Caching Strategies & Offline Storage

### HTTP Caching Headers

* **`Cache-Control: max-age=31536000, immutable`:** Used for content-hashed static assets (e.g., `main.a8f9c.js`). Serves directly from browser cache without revalidation.
* **`Cache-Control: no-cache`:** Must revalidate with server before using cached copy (`ETag` or `Last-Modified` validation).
* **`Cache-Control: no-store`:** Prevents browser or intermediary proxies from storing responses (used for sensitive financial/personal data).

### Service Worker Caching Strategies

* **Stale-While-Revalidate:** Serves immediate cached response while fetching updated version from network in background for next request.
* **Cache First (Network Fallback):** Checks local cache first; fetches from network only on cache miss. Ideal for static UI assets, fonts, and icons.
* **Network First (Cache Fallback):** Fetches fresh data from network; falls back to cache if offline. Ideal for dynamic APIs and live data.

---

## 5. Network Protocols & Compression

### HTTP/1.1 vs HTTP/2 vs HTTP/3

* **HTTP/1.1:** Head-of-line blocking (single request per TCP connection domain limit of ~6 parallel connections). Requires bundling and domain sharding.
* **HTTP/2:** Multiplexed requests over single TCP connection, binary frame encoding, header compression (HPACK), and Server Push. Eliminates need for domain sharding and massive bundle concatenations.
* **HTTP/3 (QUIC):** Operates over UDP instead of TCP. Eliminates TCP-level Head-of-Line blocking when packet loss occurs on individual streams.

### Data Compression Formats

* **Brotli (`br`):** Modern context-aware compression offering 15–20% better compression ratios than Gzip for text assets (HTML/CSS/JS).
* **Gzip (`gzip`):** Legacy fallback standard for compressable network payloads.