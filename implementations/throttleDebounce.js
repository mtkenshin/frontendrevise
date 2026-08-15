class TaskQueue {
  constructor({ maxConcurrent = 2 } = {}) {
    this.maxConcurrent = maxConcurrent;
    this.keyMap = new Map();
    this.taskCount = 0;
    this.queue = [];
  }
  /**
   * @param {Function} fn - () => Promise<any> | any
   * @param {Object} options
   * @param {'immediate'|'debounce'|'throttle'} [options.strategy='immediate']
   * @param {number} [options.delay=0]
   * @param {string} [options.key='global']
   * @returns {Promise<any>}
   */
  enqueue(fn, { strategy = 'immediate', delay = 0, key = 'global' } = {}) {
    return new Promise((resolve, reject) => {
      const task = { fn, resolve, reject, key };
      
      switch(strategy) {
        case 'immediate': // run task;
          this.scheduleTask(task);
          break;
        case 'debounce':
          this.runDebounce(task, delay);
          break;
        case 'throttle': 
          this.runThrottle(task, delay);
          break;
      }

    })
  };

  getKeyState(key) {
    if(!this.keyMap.has(key)) {
      this.keyMap.set(key, {timer: null, lastExecuted: 0, pendingTask: null})
    }
    return this.keyMap.get(key)
  };

  scheduleTask(task) {
    this.queue.push(task);
    this.processNextTask();
  };

  async processNextTask() {
    if(this.taskCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    this.taskCount++;

    try {
      const response = await task.fn();
      task.resolve(response)
    }catch(err) {
      task.reject(err);
    } finally {
      this.taskCount--;
      this.processNextTask();
    }
  };

  runDebounce(task, delay) {
    const state = this.getKeyState(task.key);

    if(state?.timer) {
      clearTimeout(state.timer)
    }

    if(state?.pendingTask) {
      state.pendingTask.reject('ABORTED');
    }

    state.pendingTask = task;
    state.timer = setTimeout(() => {
      state.timer = null;
      state.pendingTask = null;
      this.scheduleTask(task);
    }, delay)

  };

  runThrottle(task, delay) {
    const state = this.getKeyState(task.key)
    const now = Date.now();

    if(now - state?.lastExecuted >= delay) {
      state.lastExecuted = now;
      this.scheduleTask(task)
    }else {
      task.reject('ABORTED');
    }

  };
}

// Test cases

const queue = new TaskQueue({ maxConcurrent: 1 });
const logs = [];
const log = (msg) => logs.push(`${Date.now() - start}ms: ${msg}`);
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const start = Date.now();
queue.enqueue(async () => { log('Debounce 1'); return 1; }, { strategy: 'debounce', delay: 100, key: 'search' })
  .catch(err => log(`Debounce 1 ${err}`));

queue.enqueue(async () => { log('Debounce 2'); return 2; }, { strategy: 'debounce', delay: 100, key: 'search' })
  .catch(err => log(`Debounce 2 ${err}`));

queue.enqueue(async () => { log('Debounce 3'); return 3; }, { strategy: 'debounce', delay: 100, key: 'search' })
  .then(val => log(`Debounce 3 Result: ${val}`));
  // 2. Throttle Test (Key: 'scroll')
// Call 1 executes immediately. Call 2 (at 20ms) drops.
queue.enqueue(async () => { await delay(50); return 'Scroll 1'; }, { strategy: 'throttle', delay: 150, key: 'scroll' })
  .then(val => log(`Throttle 1: ${val}`));

setTimeout(() => {
  queue.enqueue(async () => 'Scroll 2', { strategy: 'throttle', delay: 150, key: 'scroll' })
    .catch(err => log(`Throttle 2: ${err}`));
}, 20);

// Print results after 500ms
setTimeout(() => console.log(logs.join('\n')), 500);

