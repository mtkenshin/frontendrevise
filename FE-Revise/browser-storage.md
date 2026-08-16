# Browser Storage

| Feature | Cookies | LocalStorage | SessionStorage |
| :--- | :--- | :--- | :--- |
| **Capacity** | ~4 KB | ~5 MB - 10 MB | ~5 MB |
| **Expiration** | Set manually (or expires when session ends) | Never (persists until manually cleared) | When tab/window is closed |
| **Scope** | Any window/tab (same domain) | Any window/tab (same origin) | Same tab only |
| **Sent to Server** | Sent automatically with every HTTP request | Client-side only | Client-side only |
| **Primary Use Case** | Authentication tokens, session IDs | User preferences, persistent app data | Temporary data (e.g., form progress) |

---

* **Cookies**: Best for server-side authorization. Since they travel with every HTTP request, keeping them small is essential to avoid slowing down requests.
* **LocalStorage**: Best for client-side persistence across browser restarts, such as dark mode settings or cached user data.
* **SessionStorage**: Best for isolated, temporary data tied to a single browsing session, such as a multi-step form state or a single-tab shopping cart.


---

## Other Storage Methods

* **IndexedDB**: A low-level, transactional API for storing large amounts of structured data, including files and blobs. It uses indexes to enable high-performance searches on the data.
* **Cache API**: Designed specifically to store pairs of HTTP request and response objects. It is primary used in conjunction with **Service Workers** to enable offline access and speed up network requests.
* **WebSQL**: An older API for storing data using SQL queries. **Note:** This feature has been officially deprecated and removed from modern browser standards.
* **FileSystem Access API**: Allows web applications to read or save changes directly to files and folders on the user's local device.
* **Origin Private File System (OPFS)**: A private, fast, isolated virtual file system provided as part of the FileSystem Access API, optimized for high-performance read/write access.