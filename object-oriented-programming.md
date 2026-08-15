# Object-Oriented Design & Principles

## Fundamental OOP Pillars

* **Encapsulation:** Bundles data (attributes) and methods (functions) inside a class while restricting direct access to internal states (using private/protected modifiers).
``` js
class BankAccount {
  #balance; // Private field

  constructor(balance) {
    this.#balance = balance;
  }

  getBalance() {
    return this.#balance;
  }
}
```

* **Abstraction:** Hides complex implementation details and exposes only the essential interface to the user (e.g., abstract classes, interfaces).
``` js
class Shape {
  area() {
    throw new Error("Method 'area()' must be implemented.");
  }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  area() {
    return this.side * this.side;
  }
}
```

* **Inheritance:** Enables a child class to inherit properties and behaviors from a parent class, promoting code reuse.
``` js
class Animal {
  speak() {
    return "Animal sound";
  }
}

class Dog extends Animal {
  speak() {
    return "Woof!";
  }
}
```

* **Polymorphism:** Allows objects of different classes to respond to the same method call in unique ways (via method overriding or overloading).

``` js 
const makeItSpeak = (animal) => console.log(animal.speak());

makeItSpeak(new Dog()); // Output: Woof!
makeItSpeak(new Cat()); // Output: Meow!
```

## SOLID Design Principles

* **Single Responsibility Principle (SRP):** A class should have one, and only one, reason to change.
```js
// Good: User holds state, UserRepository handles storage
class User {
  constructor(name) {
    this.name = name;
  }
}

class UserRepository {
  save(user) {
    console.log(`Saving ${user.name} to DB`);
  }
}
```

* **Open/Closed Principle (OCP):** Software entities should be open for extension, but closed for modification.
```js 
// Extended via inheritance without altering base Discount class logic
class Discount {
  getDiscount() {
    return 0;
  }
}

class VIPDiscount extends Discount {
  getDiscount() {
    return 20;
  }
}
```

* **Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without breaking application functionality.
```js
class Bird {
  move() {
    return "Moving";
  }
}

class Penguin extends Bird {
  move() {
    return "Swimming"; // Behaves safely as a Bird without breaking code expecting fly()
  }
}
```

* **Interface Segregation Principle (ISP):** Clients should not be forced to depend on interfaces they do not use (prefer small, specific interfaces over large ones).
```js
// Composition of small functional interfaces instead of one bloated interface
const canWork = { work: () => console.log("Working") };
const canEat = { eat: () => console.log("Eating") };

const human = { ...canWork, ...canEat };
```
* **Dependency Inversion Principle (DIP):** High-level modules should depend on abstractions, not on concrete implementations.
```js
// High-level Computer depends on abstraction interface, passed in via constructor
class Computer {
  constructor(keyboard) {
    this.keyboard = keyboard; // Accepts any keyboard implementation
  }
}
```

## Key Best Practices

* **Composition Over Inheritance:** Prefer combining simple objects to build complex behavior rather than using deep class inheritance hierarchies.
```js
const createEngine = () => ({ start: () => "Vroom" });

class Car {
  constructor() {
    this.engine = createEngine(); // Has-a relationship
  }
}
```

* **DRY (Don't Repeat Yourself):** Avoid duplicate code by abstracting common logic into single, reusable components.
```js
// Abstract reusable calculations into a single helper function
const calculateTax = (price, rate = 0.18) => price * rate;
```
* **KISS (Keep It Simple, Stupid):** Design classes and relationships to be straightforward and minimal.
```js
// Clear, concise boolean return
const isEven = (number) => number % 2 === 0;
```