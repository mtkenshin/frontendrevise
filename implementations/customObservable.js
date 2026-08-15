class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observerOrNext, error, complete) {
    // Normalize input to a standard observer object
    const observer =
      typeof observerOrNext === 'function'
        ? { next: observerOrNext, error, complete }
        : observerOrNext || {};

    let isUnsubscribed = false;
    let teardown = null;

    // SafeObserver guards against emissions after unsubscribe, error, or complete
    const safeObserver = {
      next: (value) => {
        if (!isUnsubscribed && observer.next) {
          try {
            observer.next(value);
          } catch (err) {
            safeObserver.error(err);
          }
        }
      },
      error: (err) => {
        if (!isUnsubscribed) {
          isUnsubscribed = true;
          try {
            if (observer.error) observer.error(err);
          } finally {
            if (typeof teardown === 'function') teardown();
          }
        }
      },
      complete: () => {
        if (!isUnsubscribed) {
          isUnsubscribed = true;
          try {
            if (observer.complete) observer.complete();
          } finally {
            if (typeof teardown === 'function') teardown();
          }
        }
      },
    };

    // Execute the subscriber logic
    try {
      const cleanup = this._subscribe(safeObserver);
      if (typeof cleanup === 'function') {
        teardown = cleanup;
      }
    } catch (err) {
      safeObserver.error(err);
    }

    // Return Subscription handle
    return {
      unsubscribe: () => {
        if (!isUnsubscribed) {
          isUnsubscribed = true;
          if (typeof teardown === 'function') {
            teardown();
          }
        }
      },
    };
  }

  map(fn) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (val) => {
          try {
            observer.next(fn(val));
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  }

  filter(predicate) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (val) => {
          try {
            if (predicate(val)) {
              observer.next(val);
            }
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  }
}


const logs = [];

// Create source observable
const stream$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.complete();
  observer.next(5); // Should be ignored after complete
});

// Chain operators
const subscription = stream$
  .map((x) => x * 10)
  .filter((x) => x > 20)
  .subscribe({
    next: (val) => logs.push(`NEXT: ${val}`),
    error: (err) => logs.push(`ERROR: ${err}`),
    complete: () => logs.push('COMPLETE'),
  });

console.log(logs.join('\n'));
// Expected output:
// NEXT: 30
// NEXT: 40
// COMPLETE