# Framework & Component Patterns - Revision Guide

This guide covers rendering paradigms, virtual DOM reconciliation, component design patterns, and accessibility principles required for senior and lead frontend interviews.

---

## 1. Rendering Paradigms

Selecting the right rendering architecture depends on content dynamicism, SEO requirements, user authorization boundaries, and performance goals.

| Paradigm | Location | Pros | Cons | Best Use Cases |
| --- | --- | --- | --- | --- |
| **CSR** (Client-Side Rendering) | Browser | Fast sub-page navigation, low server workload | Poor initial TTFB/FCP, poor SEO without hydration pre-rendering | Authenticated web applications, SaaS dashboards |
| **SSR** (Server-Side Rendering) | Server (Per Request) | Fast FCP, SEO friendly, access to request context | Higher server load, delayed Time to Interactive (TTI) due to JS hydration | Dynamic e-commerce catalogs, news portals |
| **SSG** (Static Site Generation) | Server (Build Time) | Zero server rendering cost, highly cacheable at CDN edge | Long build times for large sites, stale content until rebuild | Documentation sites, corporate blogs, marketing pages |
| **ISR** (Incremental Static Regeneration) | Server (Background On-Demand) | Combines SSG speed with dynamic background cache updates | Eventual consistency risks, potential cache invalidation complexity | Large e-commerce platforms with thousands of SKU pages |

---

## 2. Reactivity, Virtual DOM & Reconciliation

### Virtual DOM Mechanics

Frameworks like React or Vue maintain an in-memory lightweight JS object representation of the real DOM.

1. **Trigger:** State or prop changes spawn a new Virtual DOM tree representation.
2. **Diffing:** The framework executes a diffing algorithm (e.g., React Fiber reconciler, Vue's compiler-optimized block tree diffing) comparing the new Virtual DOM with the previous snapshot.
3. **Reconciliation:** The framework computes the minimum number of DOM mutations and batches writes to the actual browser DOM tree during the render phase.

### Key Rules & Pitfalls

* **The Importance of `key` Props:** Keys provide persistent identities for collection elements across render passes. Omitting or using array indices as keys causes DOM node reuse errors, broken local component state, and unnecessary DOM node recreations.
* **Stale Closures:** Asynchronous callbacks or effect hooks capturing stale values from past render cycles due to missing dependency array items or unmanaged reactive state references.
* **Batching:** Modern framework engines automatically batch multiple state updates occurring within event handlers or microtask queues into a single re-render cycle to prevent layout thrashing.

---

## 3. Advanced Component Design Patterns

* **Render Props / Slot Pattern:** Delegation of UI rendering logic to parent components while preserving internal state encapsulation.
* **Higher-Order Components (HOC) / Composables:** Abstracting cross-cutting concerns (e.g., analytics tracking, auth guards, data fetching hooks) into reusable wrappers or modular functions.
* **Compound Components:** A set of components that work together to manage shared implicit state (e.g., `<Select>`, `<Option>` or `<Accordion>`, `<AccordionItem>`).

```
// Compound Component Structure Example
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview Panel Content</TabsContent>
  <TabsContent value="settings">Settings Panel Content</TabsContent>
</Tabs>

```

---

## 4. Accessibility (a11y) & Native DOM Integration

### Core Accessibility Standards

* **Semantic Markup:** Utilizing structural HTML tags (`<main>`, `<nav>`, `<header>`, `<article>`, `<button>`) instead of unsemantic `<div>` or `<span>` elements to build accessibility trees natively.
* **WAI-ARIA Best Practices:** Use ARIA attributes (`aria-expanded`, `aria-hidden`, `aria-live`, `role="dialog"`) to bridge UI gaps only when native HTML tags cannot satisfy complex interactive widgets. *Rule of thumb: First rule of ARIA is to not use ARIA if a native HTML element exists.*
* **Focus Management:**
* **Focus Traps:** Restricting `Tab` key navigation within open modal dialogs to prevent keyboard focus from bleeding into background page content.
* **Focus Restoration:** Returning keyboard focus back to the triggering element after a modal or drawer closes.



### Native DOM Mechanics

* **Event Delegation:** Attaching a single event listener to a parent container to capture events bubbling up from child elements (`event.target`), reducing memory overhead for long dynamic lists.
* **Custom Events & Shadow DOM:** Encapsulating DOM structures and styling boundaries using Shadow DOM roots while communicating across component boundaries using custom `dispatchEvent(new CustomEvent(...))`.