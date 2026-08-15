### How JavaScript Works as an Engine

JavaScript engines (like Google Chrome's V8 or Mozilla's SpiderMonkey) execute code by taking high-level JavaScript and converting it into machine code that the CPU can execute.

1. **Parsing:** The engine reads source code and breaks it into tokens (Lexical Analysis), then builds an **Abstract Syntax Tree (AST)**.
2. **Compilation (JIT):** Modern engines use Just-In-Time (JIT) compilation. An interpreter (e.g., V8's *Ignition*) quickly turns the AST into bytecode for fast startup.
3. **Optimization:** A JIT compiler (e.g., V8's *TurboFan*) monitors running code, identifies hot functions (frequently executed code), and compiles them into optimized machine code. If assumptions break (e.g., dynamic type changes), it "deoptimizes" back to bytecode.

```javascript
// Function identified as "hot" by the engine
function add(a, b) {
  return a + b;
}

// Called thousands of times with integers -> Engine compiles to direct machine assembly
for (let i = 0; i < 10000; i++) {
  add(i, 1);
}

// Type change forces engine to deoptimize back to bytecode
add("hello", "world");

```

---

### Differences Between `const`, `let`, and `var`

Variables in JavaScript differ based on scoping rules, redeclaration capabilities, and reassignment permissions.

* **`var`:** Function-scoped, can be redeclared and reassigned, hoisted with an initial value of `undefined`.
* **`let`:** Block-scoped (`{}`), cannot be redeclared in the same scope, can be reassigned, hoisted into the Temporal Dead Zone (TDZ).
* **`const`:** Block-scoped (`{}`), cannot be redeclared or reassigned (must be initialized on declaration), hoisted into the TDZ. *Note: Object properties inside a `const` reference remain mutable.*

```javascript
// var (Function Scoped)
function varExample() {
  var x = 1;
  if (true) {
    var x = 2; // Same variable!
    console.log(x); // 2
  }
  console.log(x); // 2
}

// let & const (Block Scoped)
function letConstExample() {
  let y = 1;
  const z = { name: "Alice" };
  
  if (true) {
    let y = 2; // Distinct local variable
    console.log(y); // 2
  }
  console.log(y); // 1

  // z = {}; // TypeError: Assignment to constant variable.
  z.name = "Bob"; // Allowed: Mutating object contents
}

```

---

### Hoisting

Hoisting is JavaScript's default behavior of moving declarations to the top of their containing scope during the compilation phase before code execution.

* **Function Declarations:** Fully hoisted; can be called before declaration in code.
* **`var` Declarations:** Declaration is hoisted and initialized to `undefined`.
* **`let` / `const` Declarations:** Declaration is hoisted, but remains uninitialized.

```javascript
// Function Hoisting
greet(); // Output: "Hello!"
function greet() {
  console.log("Hello!");
}

// var Hoisting
console.log(myVar); // Output: undefined
var myVar = 42;

// Equivalent runtime step for var:
// var myVar;
// console.log(myVar);
// myVar = 42;

```

---

### Temporal Dead Zone (TDZ)

The Temporal Dead Zone (TDZ) is the period between entering a scope and the actual execution of a `let` or `const` declaration. Accessing the variable during this period triggers a `ReferenceError`.

```javascript
{
  // TDZ for variable 'a' starts here!
  // console.log(a); // Uncaught ReferenceError: Cannot access 'a' before initialization
  
  let a = 10; // TDZ ends here for 'a'
  console.log(a); // Output: 10
}

```

---

### Closures

A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). Closures give inner functions access to an outer function's scope even after the outer function has executed and returned.

```javascript
function createCounter() {
  let count = 0; // Private state variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    getValue: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getValue());   // 2

```

---

### Event Loop

JavaScript runs on a single-threaded execution model using an Event Loop to handle asynchronous operations.

1. **Call Stack:** Executes synchronous code stack frames sequentially.
2. **Web APIs:** Offloads asynchronous work (timers, network requests, DOM events).
3. **Microtask Queue:** High-priority queue for Promises and `queueMicrotask`. Drained completely before the next event loop tick.
4. **Macrotask Queue:** Queue for `setTimeout`, `setInterval`, and I/O. Drained one task per event loop tick.

```javascript
console.log("1: Synchronous");

setTimeout(() => {
  console.log("2: Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Microtask (Promise)");
});

console.log("4: Synchronous");

// Output Order:
// 1: Synchronous
// 4: Synchronous
// 3: Microtask (Promise)
// 2: Macrotask (setTimeout)

```

---

### Shallow Copy Scenarios

A shallow copy duplicates the top-level properties of an object or array. If any properties refer to nested objects or arrays, those references remain connected to the original data structure.

* Common shallow copying methods: Spread operator (`...`), `Object.assign()`, `Array.prototype.slice()`.

```javascript
const original = {
  name: "Sarah",
  skills: ["JavaScript", "CSS"]
};

// Shallow copy using spread operator
const copy = { ...original };

copy.name = "Alex"; // Primitive change affects copy only
copy.skills.push("HTML"); // Array reference shared! Affects original too.

console.log(original.name);   // "Sarah"
console.log(copy.name);       // "Alex"
console.log(original.skills); // ["JavaScript", "CSS", "HTML"]

```

---

### Maps, WeakMaps, and Sets

Key-value and value-set data structures introduced in ES6 for specific storage and lookup scenarios.

* **`Set`:** Collection of unique values (primitives or object references).
* **`Map`:** Key-value pairs where keys can be **any type** (objects, functions, primitives), preserving insertion order.
* **`WeakMap`:** Key-value pairs where keys **must be objects**. Holds keys weakly, allowing garbage collection if no other references to the key object exist. Not iterable.

```javascript
// Set: Unique Values
const uniqueNumbers = new Set([1, 2, 2, 3]);
uniqueNumbers.add(4);
console.log(uniqueNumbers.has(2)); // true
console.log([...uniqueNumbers]);   // [1, 2, 3, 4]

// Map: Any key type
const userMap = new Map();
const objKey = { id: 1 };
userMap.set(objKey, "Active User");
console.log(userMap.get(objKey)); // "Active User"

// WeakMap: Weak object references
let metadata = new WeakMap();
let element = { id: "button-1" };

metadata.set(element, { clicks: 5 });
console.log(metadata.get(element)); // { clicks: 5 }

element = null; // Object is dereferenced and eligible for garbage collection along with its WeakMap entry

```

## Object Prototype

`Object.prototype` is the root prototype object in JavaScript's prototype chain. Almost all objects in JavaScript inherit their default properties and methods—such as `.toString()`, `.valueOf()`, and `.hasOwnProperty()`—from `Object.prototype`.

---

### Key Characteristics

* **Top of the Prototype Chain:** `Object.prototype.__proto__` evaluates to `null`. This represents the final link in the lookup chain.
* **Base Object Template:** Every standard object literal (`{}`) or object instantiated via `new Object()` directly inherits from `Object.prototype`.
* **Universal Availability:** Because of prototypical inheritance, primitives wrapped into objects, arrays, functions, and custom instances can access methods defined on `Object.prototype`.

---

### Practical Examples

```javascript
const user = { name: "Alice" };

// Method inherited directly from Object.prototype
console.log(user.toString()); // Output: "[object Object]"

// Checking property ownership without prototype inheritance lookup
console.log(Object.prototype.hasOwnProperty.call(user, "name")); // Output: true

// Prototypal chain termination
console.log(Object.getPrototypeOf(user) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype));          // null

```

---

### Objects Without `Object.prototype`

An object can be created without inheriting from `Object.prototype` by using `Object.create(null)`. This creates a completely dictionary-like bare object with no built-in methods or default prototype properties.

```javascript
// Bare object (no prototype chain)
const pureMap = Object.create(null);

pureMap.key = "value";

console.log(pureMap.toString); // Output: undefined
console.log(Object.getPrototypeOf(pureMap)); // Output: null

```