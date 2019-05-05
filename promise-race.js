// Example #2 - Promise.race
/* Explanation of Example 2 (Max Belsky)
* Next we will write a Promise.race polyfill.
* We use a common Patten in both functions to handle resolved promises and different tools to handle rejected promises
*/
const promiseRaceOnRejected = (promises = []) => {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {promise.then(result => resolve(result), error => reject(error))})
  })
};

const promiseRaceCatch = (promises = []) => {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {promise.then(result => resolve(result)).catch(error => reject(error))})
  })
};

// Try some tests to be sure that both solutions work well (Max Belsky)
// A helper function to create a delayed promise
const getPromise = (resolveMs, rejectMs) => {
  return new Promise((resolve, reject) => {
    if ('number' === typeof rejectMs) {setTimeout(() => reject(rejectMs), rejectMs)}
    if ('number' === typeof resolveMs) {setTimeout(() => resolve(resolveMs), resolveMs)}
  })
};

const testRaces = async () => {
  const r1 = await promiseRaceOnRejected([getPromise(0), getPromise(5)]); // 0
  const r2 = await promiseRaceCatch([getPromise(0), getPromise(5)]); // 0
  const r3 = await promiseRaceOnRejected([getPromise(5), getPromise(null, 2)]).catch(e => e); // 2
  const r4 = await promiseRaceCatch([getPromise(5), getPromise(null, 2)]).catch(e => e); // 2
//As you can see, both polyfills work as expected.
// Arguments order and rejected promises handler variation don’t matter. Until we try it with the next set of tests
  const r5 = await promiseRaceOnRejected([Promise.resolve('Resolve'), Promise.reject('Reject')]); // Resolve
  const r6 = await promiseRaceCatch([Promise.resolve('Resolve'), Promise.reject('Reject')]); // Resolve
  const r7 = await promiseRaceOnRejected([Promise.reject('Reject'), Promise.resolve('Resolve')]).catch(e => e); // Reject
  const r8 = await promiseRaceCatch([Promise.reject('Reject'), Promise.resolve('Resolve')]).catch(e => e); // ???
// The fifth, sixth and seventh races return expected values. What about the eighth?
// Instead of Reject it returns Resolve and it is not a bug.
};

testRaces().catch(e => e);

// Explanation (Max Belsky)
/*
 * Depending on the job’s result, a pending promise changes its state to resolved or rejected. JS environment puts that promise in a microtasks queue.
 * Like it described in ECMA 2015 specification, this queue works by the FIFO principle — first in, first out. Base on this, let’s review the eighth race’s case.
 * At the start of the race, we already have two queued promises, and the rejected is first. (.then) without a second argument cannot handle a rejected promise, so it puts the promise back into the queue.
 * And instead of handling this promise with .catch, the JS environment switches to p2 because it has higher priorities in the queue.
 * On next tick .then handles p2 and the race ends with Resolve result.
 */
