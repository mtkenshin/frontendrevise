Your markdown revision guide for **Core JavaScript Internals & Runtime** has been created and saved as a skill module (`frontend-core-javascript-internals`).

### Summary of Covered Topics

* **Asynchronous JS & Event Loop:** Visual execution lifecycle, Call Stack, Web APIs, Microtask vs. Macrotask queue priority rules, and microtask starvation.
* **Execution Context & Scope:** Creation vs. Execution phases, Hoisting, Temporal Dead Zone (TDZ), Lexical Scope, and Closures.
* **`this` Binding Rules:** Implicit, Explicit, `new` keyword, and Lexical Arrow function binding behavior.
* **Memory Management & Garbage Collection:** Mark-and-Sweep algorithm, GC roots, and real-world SPA memory leak patterns.
* **Prototypes & Advanced JS Features:** Prototype chain lookups, ESM vs. CommonJS resolution, `WeakMap`/`WeakSet`, and `Proxy`/`Reflect`.

# Core JavaScript Internals & Runtime - Revision Guide

This guide covers core JavaScript runtime mechanics, asynchronous execution, memory management, and modern language features required for senior/lead technical interviews.

---

## 1. Asynchronous JavaScript & The Event Loop

### The Runtime Architecture

JavaScript is single-threaded (executes one frame of code at a time on a single call stack). The runtime environment (Browser or Node.js) provides Web APIs / C++ bindings to handle asynchronous operations off the main thread.

```
+-------------------------------------------------------------+
|                        Call Stack                           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                         Web APIs                            |
|             (DOM, setTimeout, fetch, etc.)                  |
+-------------------------------------------------------------+
                              |
               +--------------+--------------+
               |                             |
               v                             v
+-----------------------------+  +----------------------------+
|      Microtask Queue        |  |  Macrotask (Task) Queue    |
| - Promise callbacks (.then) |  | - setTimeout / setInterval |
| - queueMicrotask            |  | - requestAnimationFrame*   |
| - MutationObserver          |  | - I/O, UI rendering events |
| - process.nextTick (Node)   |  |                            |
+-----------------------------+  +----------------------------+
```


### Draining Order Rule
1. Execute synchronous code on the **Call Stack** until empty.
2. Process **ALL** jobs in the **Microtask Queue** before moving on. If microtasks enqueue more microtasks, the runtime continues draining the microtask queue (which can starve the macrotask queue and UI rendering).
3. Process **ONE** task from the **Macrotask Queue**.
4. Re-evaluate rendering / frame updates if needed (Browser).
5. Repeat the cycle.

---

## 2. Execution Context, Scope & Closures

### Execution Context Lifecycle
When code runs in JS, an **Execution Context** is created in two phases:
1. **Creation Phase**:
   - Creates the **Lexical Environment** and **Variable Environment**.
   - Sets up the scope chain.
   - Binds `this`.
   - Allocates memory for variables and declarations (**Hoisting**). `var` initialized to `undefined`; `let`/`const` placed in Temporal Dead Zone (TDZ).
2. **Execution Phase**:
   - Code executed line-by-line; variables assigned actual values.

### Lexical Scope & Closures
* **Lexical Scope**: Scope is determined statically at code authoring/parse time based on function declaration location, not runtime invocation location.
* **Closure**: A function bundled together with references to its surrounding state (lexical environment). Closures allow inner functions to access outer scope variables even after the outer function has returned.

---

## 3. Dynamic vs. Lexical `this` Binding

`this` evaluation rules:
1. **Implicit Binding**: `obj.fn()` -> `this` equals `obj`.
2. **Explicit Binding**: `fn.call(ctx)`, `fn.apply(ctx, args)`, `fn.bind(ctx)` -> `this` equals `ctx`.
3. **New Binding**: `new Fn()` -> `this` equals newly created object instance.
4. **Arrow Functions**: Arrow functions do **not** have their own `this`. They inherit `this` lexically from the enclosing execution context at definition time.

---

## 4. Memory Management & Garbage Collection

### Mark-and-Sweep Algorithm
Modern JS engines (V8, JavaScriptCore, SpiderMonkey) use **Mark-and-Sweep**:
1. **Roots**: Engine establishes a set of roots (e.g., global window object, currently active stack frame variables).
2. **Mark Phase**: Garbage collector traverses all references recursively from roots and marks reachable objects.
3. **Sweep Phase**: Unmarked objects are unallocated and freed from memory.

### Common Memory Leaks in Single-Page Applications (SPAs)
* **Detached DOM Nodes**: Keeping references to DOM elements in JS arrays/objects after removing them from the DOM tree.
* **Uncleaned Event Listeners / Timers**: `setInterval` callbacks retaining outer scope variables without `clearInterval` on component unmount.
* **Accidental Global Variables**: Omitting variable declarations (`this.data = ...` in global context).
* **Console Logs**: In some browser engines, keeping references inside `console.log` payloads prevents GC in devtools contexts.

---

## 5. Prototypes, ES Modules & Modern Primitives

### Prototypal Inheritance
* Objects have an internal `[[Prototype]]` link accessed via `Object.getPrototypeOf(obj)` or `__proto__`.
* Property lookups walk up the prototype chain until found or reaching `Object.prototype.__proto__ === null`.

### ES Modules vs. CommonJS
| Feature | ES Modules (ESM) | CommonJS (CJS) |
|---|---|---|
| **Loading** | Asynchronous / Static parse-time graph | Synchronous / Dynamic runtime load |
| **Import Syntax** | `import { x } from 'mod'` | `const x = require('mod')` |
| **Bindings** | Live read-only bindings | Value exports (shallow copies) |
| **Tree-shaking** | Fully supported via static AST analysis | Difficult / Limited |


### Specialized Memory Structure Collections
* **`WeakMap` / `WeakSet`**: Keys must be objects/symbols. Holds **weak** references to keys, allowing garbage collection if no other references exist. Ideal for metadata tagging and private caches without leaking memory.
* **`Proxy` & `Reflect`**: Standard mechanism for wrapping target objects to intercept low-level meta-operations (get, set, deleteProperty, apply). Modern foundation for UI reactivity systems.

```