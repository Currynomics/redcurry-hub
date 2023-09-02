let message = 'This is a notification';
let callbacks = [];

export function getMessage(callback) {
  callback(message);
}

export function setMessage(newMessage) {
  message = newMessage;

  callbacks.forEach((callback) => callback(message)); // call all registered callbacks
}

export function registerCallback(callback) {
  callbacks.push(callback);
}

export function unregisterCallback(callback) {
  callbacks = callbacks.filter((c) => c !== callback);
}
