/**
 * @param {Function} asyncFn - () => Promise<any>
 * @param {Object} [options]
 * @param {number} [options.retries=3]
 * @param {number} [options.delay=1000]
 * @param {number} [options.backoffFactor=2]
 * @returns {Promise<any>}
 */
async function fetchWithRetry(asyncFn, options = { retries: 3, delay: 1000, backoffFactor: 2}, attempt = 0) {

  const { retries: maxAttempts, delay, backoffFactor } = options;
  try {
    return await asyncFn();
  } catch(err) {
    if(attempt >= maxAttempts) {
      throw err;
    }
    const exponetialDelay = delay * Math.pow(backoffFactor, attempt)
    await sleep(exponetialDelay)
    return fetchWithRetry(asyncFn, {retries: maxAttempts, delay, backoffFactor}, (attempt + 1))
  }
}

async function sleep(delay) {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
}

// Mock function that fails 2 times before succeeding on 3rd attempt
let attempts = 0;
const unstableApi = async () => {
  attempts++;
  console.log(`Executing attempt ${attempts} at ${Date.now() - start}ms`);
  if (attempts < 3) throw new Error(`Server Error ${attempts}`);
  return "Success!";
};

const start = Date.now();

fetchWithRetry(unstableApi, { retries: 3, delay: 200, backoffFactor: 2 })
  .then((res) => console.log("RESULT:", res))
  .catch((err) => console.error("FAILED:", err.message));
