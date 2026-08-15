When an event fires on an HTML element in JavaScript, it does not only trigger on that specific element. Instead, it travels through the DOM tree in **three distinct phases**:

1. **Capturing Phase (Trickling):** The event starts at the `window` and travels *downward* through parent elements until it reaches the target element.
2. **Target Phase:** The event hits the exact element that triggered it (e.g., a clicked button).
3. **Bubbling Phase:** The event travels *upward* through its ancestors (parent, grandparent, `document`, `window`), triggering any matching event handlers along the way—like a bubble rising to the surface.

By default, event listeners added via `addEventListener` listen during the **bubbling phase**.

---

### Example

```html
<div id="parent" style="padding: 20px; background: lightgray;">
  Parent Div
  <button id="child">Click Me</button>
</div>

```

```javascript
document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked!');
});

document.getElementById('child').addEventListener('click', () => {
  console.log('Child clicked!');
});

```

If you click the button (`#child`), the console output will be:

1. `Child clicked!` (Target phase)
2. `Parent clicked!` (Bubbling phase)

---

### Key Mechanics to Know

* **`event.target` vs. `event.currentTarget`:**
* `event.target`: The actual element that originated the event (e.g., the button).
* `event.currentTarget`: The element currently handling the event as it bubbles up (e.g., the parent `div`).


* **Stopping Propagation:**
* `event.stopPropagation()`: Prevents the event from bubbling further up the DOM tree.
* `event.stopImmediatePropagation()`: Prevents bubbling *and* stops any remaining listeners on the current element from executing.


* **Listening in the Capturing Phase:**
* You can listen during the capture phase by passing `{ capture: true }` (or `true`) as the third argument to `addEventListener`.


* **Events That Do Not Bubble:**
* Not all events bubble up. Notable exceptions include `focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `unload`, and `scroll` (on regular elements).



---

### Common Design Pattern: Event Delegation

Event bubbling enables **Event Delegation**—attaching a single listener to a parent container instead of binding individual listeners to many child elements.

```javascript
// Managing dynamic list items with a single listener on the parent <ul>
document.getElementById('shopping-list').addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('List item clicked:', event.target.textContent);
  }
});

```

**Benefits:**

* **Memory Efficiency:** Fewer active event listeners in memory.
* **Dynamic DOM Support:** Automatically works for new elements added to the list later without re-binding handlers.