# UI Architecture & System Design - Revision Guide

This guide covers scalable frontend system design, state management patterns, micro-frontends, and data integration protocols for technical lead interviews.

---

## 1. System Design Interview Framework

When approached with open-ended architecture prompts (e.g., *"Design Figma / Google Docs / Twitter Feed"*), follow a structured framework to drive the technical conversation:

```
1. Requirements & Scope  ---> 2. Data Model & State  ---> 3. Architecture & Flow ---> 4. Optimization & Security
  - Functional / Non-Func      - Local / Global / Server      - Component Hierarchy      - Caching / Virtualization
  - Technical Constraints      - Normalization Schemas        - API Protocols & Sync     - Auth / Edge / Resiliency

```

### Clarification Checklist

* **Scale & Volume:** Number of concurrent users, data throughput, payload sizes, render frequencies (60 FPS vs batch updates).
* **Device & Client Scope:** Desktop-first, mobile web, offline support requirements, browser support targets.
* **Key Bottlenecks:** Network latency, CPU-heavy client calculations, DOM node count limits, complex real-time updates.

---

## 2. State Architecture & Data Management

### Categorization Matrix

| State Type | Ownership Scope | Typical Use Cases | Management Approach |
| --- | --- | --- | --- |
| **Local / UI State** | Single Component / Subtree | Form inputs, dropdown toggles, modal open state, tab selection | Native framework primitives (`useState`, reactive refs) |
| **Global UI State** | Entire Application | App theme, active user session, notifications, layout configuration | Redux, Pinia, Zustand, React Context |
| **Server State** | Remote Database Sync | User profiles, API data tables, transactional feeds | TanStack Query, RTK Query, SWRApi wrappers |
| **URL State** | Router Engine | Active filters, pagination parameters, search query terms | Web History API, framework routers |

### Data Normalization

Normalizing nested JSON responses into relational entities prevents stale data duplicate bugs across components:

```json
// Denormalized (Prone to inconsistent state updates)
{
  "posts": [
    { "id": 1, "title": "Post A", "author": { "id": 9, "name": "Sarah" } },
    { "id": 2, "title": "Post B", "author": { "id": 9, "name": "Sarah" } }
  ]
}

// Normalized (Single Source of Truth)
{
  "entities": {
    "users": { "9": { "id": 9, "name": "Sarah" } },
    "posts": {
      "1": { "id": 1, "title": "Post A", "authorId": 9 },
      "2": { "id": 2, "title": "Post B", "authorId": 9 }
    }
  }
}

```

---

## 3. Micro-Frontends & Component Libraries

### Micro-Frontend Architecture Approaches

* **Build-time Integration:** NPM packages. Pros: Simple setup, strict typing. Cons: Requires full app redeployment for micro-app updates.
* **Run-time via Module Federation (Webpack/Vite):** Dynamically loads remote bundle chunks at runtime over HTTP. Pros: Independent deployment pipelines, shared common dependencies (e.g., framework core). Cons: Complex runtime error handling and version drift risks.
* **Run-time via Web Components:** Custom Elements encapsulating DOM/CSS with Shadow DOM. Pros: Framework agnostic. Cons: Server-side rendering complexity, event bubbling boundaries.

### Design System Architecture

* **Semantic Tokenization:** Tiered design tokens (`Option/Base` $\rightarrow$ `Semantic` $\rightarrow$ `Component`). Example: `$color-blue-500` $\rightarrow$ `$color-primary-action` $\rightarrow$ `button-bg-color`.
* **Compound Components:** Exposing flexible API boundaries allowing consumers to control composition without prop-drilling.

---

## 4. Real-time Integration & API Protocols

### Protocol Selection Matrix

| Protocol | Direction | Overhead | Reconnection / State | Best Use Cases |
| --- | --- | --- | --- | --- |
| **REST** | Request / Response | Moderate (HTTP headers per request) | Stateless | CRUD operations, traditional web forms |
| **GraphQL** | Request / Response | Moderate | Client-side cache dependent | Tailored query fetching, complex relational dashboards |
| **Server-Sent Events (SSE)** | Unidirectional (Server $\rightarrow$ Client) | Low (persistent HTTP connection) | Auto-reconnect natively supported | Stock tickers, live sports scores, LLM streaming responses |
| **WebSockets** | Full Duplex (Bi-directional) | Very Low (after initial upgrade HTTP handshake) | Manual heartbeat/ping-pong required | Collaborative editors, live chat applications, multiplayer gaming |

---

## 5. Client Security & Data Protection

* **Cross-Site Scripting (XSS):** Prevented via strict HTML sanitization (DOMPurify), avoiding raw HTML string injection (`innerHTML`/`v-html`), and enforcing strict Content Security Policy (`CSP`) headers.
* **Cross-Site Request Forgery (CSRF):** Prevented using `SameSite=Strict` or `SameSite=Lax` cookie flags alongside anti-CSRF token validation headers.
* **Sensitive Storage:** Avoid storing JWT access tokens containing sensitive claims in `localStorage`/`sessionStorage` (vulnerable to XSS). Utilize `HttpOnly`, `Secure`, `SameSite` cookies instead.