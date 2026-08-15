### Cross-Site Scripting (XSS)

XSS occurs when an application includes untrusted data in a web page without proper validation or escaping, allowing attackers to execute malicious scripts in the user's browser context (e.g., stealing session tokens, reading DOM data).

* **DOM-Based XSS:** Injected script executes by directly manipulating the DOM using unsafe sources (like `location.search` or `location.hash`) into unsafe sinks (like `innerHTML` or `eval`).

```javascript
// VULNERABLE: Direct assignment of URL input to innerHTML
const params = new URLSearchParams(window.location.search);
const name = params.get('name'); // Input: <img src=x onerror=alert('XSS')>
document.getElementById('greeting').innerHTML = `Hello, ${name}`;

// SECURE: Use textContent or DOM Sanitization libraries (e.g., DOMPurify)
document.getElementById('greeting').textContent = `Hello, ${name}`;

```

---

### Cross-Site Request Forgery (CSRF)

CSRF forces an authenticated end user to execute unwanted actions on a web application in which they're currently authenticated. Browser behavior automatically includes credentials (like cookies) with cross-origin requests unless prevented.

* **Prevention:** Use **SameSite** cookie attributes, Anti-CSRF Tokens (synchronizer token pattern), and custom authorization headers.

```javascript
// Server Response Header Setting Secure Cookie Attributes
// Set-Cookie: session=12345; Secure; HttpOnly; SameSite=Strict;

// Client-Side: Sending Anti-CSRF Token in Request Headers
async function transferFunds(recipient, amount) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  await fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken // Verified on server side
    },
    body: JSON.stringify({ recipient, amount })
  });
}

```

---

### Prototype Pollution

Prototype Pollution occurs when an attacker can manipulate `Object.prototype`, injecting properties that automatically inherit across all objects in the runtime environment. This can lead to denial-of-service, remote code execution, or security bypasses.

* **Mechanism:** Common in recursive object merging libraries that fail to sanitize keys like `__proto__`, `constructor`, or `prototype`.

```javascript
// VULNERABLE: Naive recursive merge
function merge(target, source) {
  for (let key in source) {
    if (typeof target[key] === 'object' && typeof source[key] === 'object') {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Malicious payload modifying the global Object prototype
const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
merge({}, payload);

const user = {};
console.log(user.isAdmin); // true (Polluted!)

// SECURE: Validate keys or use Object.create(null) / Map
function safeMerge(target, source) {
  for (let key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // Block prototype keys
    }
    target[key] = source[key];
  }
  return target;
}

```

---

### Content Security Policy (CSP)

Content Security Policy (CSP) is an HTTP header that allows site operators to restrict the resources (such as JavaScript, CSS, Images) that the browser is allowed to load and execute.

* **Purpose:** Serves as a strong second layer of defense against XSS by restricting inline script execution (`unsafe-inline`) and domain sources.

```http
# Example HTTP Response Header disabling inline scripts and restricting fetch targets
Content-Security-Policy: default-src 'self'; script-src 'self' https://trustedscripts.example.com; object-src 'none';

```

---

### Sensitive Data Exposure & Secure Cookie Management

JavaScript executing in the browser (`document.cookie`) can be read by XSS attacks. Session tokens and authorization identifiers must be protected using appropriate storage mechanisms and cookie flags.

* **`HttpOnly`:** Prevents client-side scripts from reading cookie data via `document.cookie`.
* **`Secure`:** Ensures cookies are transmitted only over encrypted HTTPS connections.
* **`SameSite=Strict` / `Lax`:** Restricts cross-site cookie transmission to mitigate CSRF.

```javascript
// VULNERABLE: Storing auth tokens in localStorage (Accessible to any XSS payload)
localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiI...');

// SECURE: Tokens set via server HTTP response headers (Not accessible via JavaScript)
// Set-Cookie: token=eyJhbGciOiJIUzI1NiI...; HttpOnly; Secure; SameSite=Strict;

```

---

### Code Execution via `eval()` and Dynamic Code Sinks

Using dynamic evaluation functions exposes applications to Code Injection vulnerabilities where arbitrary strings are parsed and executed as code.

* **Risks:** `eval()`, `new Function()`, `setTimeout(string)`, and `setInterval(string)`.

```javascript
// VULNERABLE: Evaluating dynamic string inputs
const userInput = "2 + 2; window.location = 'http://attacker.com'";
eval(userInput); // Executes arbitrary code

// SECURE: Use safer alternatives like JSON parsing or structured mapping
const jsonInput = '{"result": 4}';
const parsed = JSON.parse(jsonInput); // Only parses data structures, cannot execute code

```