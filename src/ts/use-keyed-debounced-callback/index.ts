export default function useKeyedDebouncedCallback<Payload>(
  callback: (payload: Payload, key?: unknown) => void,
  delay: number
) {
  // TODO: Implement the function
  // I will receive the callback and the delay
  // the function will be called with the payload and the key
  // the function will debounce the callback by key
  // if the key is not passed, it will debounce the callback by default ( maybe a symbol )
  // if the key is passed, it will debounce the callback by key
  // See the tests for more details
  // I will use a Map to store the timeouts by key
}
