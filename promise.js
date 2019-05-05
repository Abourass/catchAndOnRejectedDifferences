// Article: https://medium.freecodecamp.org/the-real-difference-between-catch-vs-onrejected-15cab8978e92
// Example #1
const getPromise = () => new Promise ((resolve, reject) => {
  Math.round(Math.random()) ? resolve('resolve #1') : reject('reject #1')
});

getPromise().then(result => {
  throw new Error('reject #2')
}, error => {
  // Handles only 'reject #1
});

getPromise().then(result => {
  throw new Error('reject #2')
})
.catch(error => {
  // Handles both 'reject #1' and 'reject #2'
});

/* Explanation of above Example (Written by Max Belsky -> Link Provided At Top of Example)
* onRejected never handles rejected promises from the same .then(onFulfilled) callback and .catch takes both.
* However besides the behavior difference, there is one more nuance.
* It’s about how these ways will be translated to microtasks and how they will be queued.
* Let’s see an example of the difference
*/
