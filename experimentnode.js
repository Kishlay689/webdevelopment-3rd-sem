// Import EventEmitter class
const EventEmitter = require('events');

// Create Button class
class Button extends EventEmitter {}

// Create object
const button = new Button();

// Click Event Listener
button.on('click', () => {
    console.log("Button Clicked!");
});

// Mouseover Event Listener
button.on('mouseover', () => {
    console.log("Mouse is over the button.");
});

// Trigger Events
button.emit('click');
button.emit('mouseover');