## Design Patterns

Design patterns are reusable solutions to common software architecture problems. They are divided into three main categories based on their intent: Creational, Structural, and Behavioral.

### Creational Patterns (Object Creation)

Focus on mechanisms for instantiating objects in a way that increases flexibility and reuse.

* **Singleton:** Ensures a class has only one instance while providing a global access point to it (e.g., database connections, configuration managers).
```javascript
class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.connection = "Connected";
    Database.instance = this;
  }
}

```


* **Factory Method:** Defines an interface for creating objects, but lets subclasses alter the type of objects that will be created.
```javascript
class ButtonFactory {
  createButton(type) {
    if (type === "admin") return new AdminButton();
    return new UserButton();
  }
}

```


* **Abstract Factory:** Produces families of related or dependent objects without specifying their concrete classes.
```javascript
class GUIFactory {
  createButton() {}
  createCheckbox() {}
}

class MacFactory extends GUIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}

```


* **Builder:** Separates the construction of a complex object from its representation, allowing step-by-step creation (e.g., complex UI elements or query builders).
```javascript
class RequestBuilder {
  setMethod(method) { this.method = method; return this; }
  setUrl(url) { this.url = url; return this; }
  build() { return new Request(this); }
}

```


* **Prototype:** Creates new objects by cloning an existing object instance rather than creating them from scratch.
```javascript
const carPrototype = {
  clone() { return Object.create(this); }
};
const myCar = carPrototype.clone();

```



### Structural Patterns (Composition & Relationships)

Focus on how classes and objects are composed to form larger structures without losing flexibility.

* **Adapter:** Allows objects with incompatible interfaces to collaborate by acting as a translator between them.
```javascript
class OldApiAdapter {
  constructor(oldApi) { this.oldApi = oldApi; }
  request() { return this.oldApi.legacyRequest(); }
}

```


* **Decorator:** Dynamically adds new functionality or behavior to an object without altering its structure or using inheritance.
```javascript
function withLogging(fn) {
  return (...args) => {
    console.log("Calling function...");
    return fn(...args);
  };
}

```


* **Facade:** Provides a simplified, high-level interface to a complex subsystem of classes.
```javascript
class ComputerFacade {
  start() {
    cpu.freeze();
    memory.load();
    cpu.execute();
  }
}

```


* **Proxy:** Provides a placeholder or surrogate object to control access to another object (e.g., lazy loading, caching, access control).
```javascript
const imageProxy = new Proxy(realImage, {
  get(target, prop) {
    if (prop === 'display') console.log("Logging display call...");
    return target[prop];
  }
});

```


* **Composite:** Composes objects into tree structures to represent part-whole hierarchies, treating individual objects and compositions uniformly.
```javascript
class Folder {
  constructor(name) { this.children = []; }
  add(child) { this.children.push(child); }
  getDetails() { this.children.forEach(c => c.getDetails()); }
}

```



### Behavioral Patterns (Communication & Responsibility)

Focus on effective communication, interaction, and the assignment of responsibilities between objects.

* **Observer:** Defines a subscription mechanism to notify multiple objects automatically about any events that happen to the object they are observing (e.g., event listeners, state reactivity).
```javascript
class Subject {
  constructor() { this.observers = []; }
  subscribe(fn) { this.observers.push(fn); }
  notify(data) { this.observers.forEach(fn => fn(data)); }
}

```


* **Strategy:** Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime (e.g., swapping payment processors or sorting methods).
```javascript
class PaymentContext {
  setStrategy(strategy) { this.strategy = strategy; }
  executePayment(amount) { return this.strategy.pay(amount); }
}

```


* **Command:** Encapsulates a request as a standalone object containing all information about the action, allowing for parameterization, queuing, or undo/redo operations.
```javascript
class LightOnCommand {
  constructor(light) { this.light = light; }
  execute() { this.light.turnOn(); }
}

```


* **State:** Allows an object to alter its behavior when its internal state changes, appearing as if it changed its class.
```javascript
class AudioPlayer {
  setState(state) { this.state = state; }
  pressPlay() { this.state.play(this); }
}

```


* **Chain of Responsibility:** Passes requests along a chain of handlers, allowing each handler to process the request or pass it to the next handler in the pipeline (e.g., middleware chains).
```javascript
class Middleware {
  setNext(next) { this.next = next; return next; }
  handle(req) { if (this.next) return this.next.handle(req); }
}

```