# ES5 vs. ES6 (ES2015) - Technical Comparison Guide

This guide details the major structural, syntactical, and feature differences between ECMAScript 5 (ES5) and ECMAScript 6 (ES6 / ES2015) for JavaScript developers and interview preparation.

---

## 1. Feature Overview & Comparison

| Feature | ES5 (2009) | ES6 / ES2015 |
| --- | --- | --- |
| **Variable Declaration** | `var` (Function-scoped, hoisted with `undefined`) | `let` and `const` (Block-scoped, Temporal Dead Zone) |
| **Functions** | Function declarations & expressions | Arrow functions (`() => {}`), default parameters, rest parameters |
| **String Formatting** | String concatenation (`+`) | Template literals (``${var}``) and multi-line strings |
| **Object Object-Oriented** | Prototype-based constructor functions | `class` syntax (syntactic sugar over prototypes), `super`, `extends` |
| **Modules** | No native support (relied on CommonJS / AMD / RequireJS) | Native ES Modules (`import` / `export`) |
| **Asynchronous JS** | Callbacks and event listeners | Promises (`Promise`), native async management |
| **Data Structures** | Arrays and plain Objects | Added `Map`, `Set`, `WeakMap`, and `WeakSet` |
| **Destructuring** | Manual assignment from objects/arrays | Object and Array destructuring syntax |
| **Spread / Rest** | `Arguments` object, `Array.prototype.slice.call()` | Spread operator (`...`) and Rest parameters |

---

## 2. Key Differences in Detail

### Variable Scope (`var` vs `let` / `const`)

* **ES5 (`var`):** Variables are function-scoped or globally scoped. Declarations are hoisted to the top of their scope and initialized with `undefined`.


* **ES6 (`let` / `const`):** Introduced block scope (anything inside `{}`). Variables are hoisted but remain uninitialized in the **Temporal Dead Zone (TDZ)** until their definition line is executed. `const` prevents re-assignment.



### Arrow Functions & `this` Binding

* **ES5:** Functions require the `function` keyword and dynamic `this` binding based on how the function is invoked. Fixing context required manual `bind(this)` or assigning `var self = this`.


* **ES6:** Arrow functions provide a concise syntax and lexical `this` binding—inheriting `this` directly from the enclosing scope at definition time.



### Classes & Inheritance

* **ES5:** Uses constructor functions and manual prototype chain manipulation:


```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return 'Hello, ' + this.name;
};

```


* **ES6:** Introduces the `class` keyword as formal syntactic sugar over prototypal inheritance:


```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello, ${this.name}`;
  }
}

```



### Modules

* **ES5:** Non-standardized native module system. Codebases relied on external module systems like CommonJS (`require()`) or AMD.


* **ES6:** Introduced native browser-level ES Modules using `import` and `export` statements, supporting static AST analysis for tree-shaking.



### Promises & Async Control

* **ES5:** Asynchronous logic relied heavily on nested callback functions, often resulting in "Callback Hell" or complex event emitter patterns.


* **ES6:** Introduced native `Promise` objects (`.then()`, `.catch()`, `Promise.all()`), standardizing asynchronous operations before `async/await` arrived in ES2017.