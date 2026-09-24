const EventEmitter = require("events");

class Element extends EventEmitter {
    constructor(name, parent = null) {
        super();
        this.name = name;
        this.parent = parent;
    }

    addEventListener(type, handler) {
        this.on(type, handler);
    }

    removeEventListener(type, handler) {
        this.off(type, handler);
    }

    dispatchEvent(type, data = {}) {
        const event = {
            type: type,
            target: this,
            currentTarget: this,
            data: data,
            stopped: false,

            stopPropagation() {
                this.stopped = true;
            }
        };

        let currentElement = this;

        while (currentElement !== null) {
            event.currentTarget = currentElement;

            
            const listeners = currentElement.listeners(type);

            for (const handler of listeners) {
                handler(event);

                if (event.stopped) {
                    break;
                }
            }

            
            if (event.stopped) {
                break;
            }

            
            currentElement = currentElement.parent;
        }
    }
}

const documentElement = new Element("document");
const form = new Element("form", documentElement);
const button = new Element("button", form);



function documentClickHandler(event) {
    console.log(
        `document handler | target: ${event.target.name} | currentTarget: ${event.currentTarget.name}`
    );
}

function formClickHandler(event) {
    console.log(
        `form handler | target: ${event.target.name} | currentTarget: ${event.currentTarget.name}`
    );
}

function buttonClickHandler(event) {
    console.log(
        `button handler | target: ${event.target.name} | currentTarget: ${event.currentTarget.name}`
    );
}



documentElement.addEventListener("click", documentClickHandler);
form.addEventListener("click", formClickHandler);
button.addEventListener("click", buttonClickHandler);



console.log("\n===== SCENARIO A =====");
console.log("Clicking button:");

button.dispatchEvent("click", {
    message: "Button clicked"
});



console.log("\n===== SCENARIO B =====");
console.log("Form will now stop propagation:");



form.removeEventListener("click", formClickHandler);

function formStopHandler(event) {
    console.log(
        `form handler | target: ${event.target.name} | currentTarget: ${event.currentTarget.name}`
    );

    console.log("form calls stopPropagation()");

    event.stopPropagation();
}

form.addEventListener("click", formStopHandler);

console.log("Clicking button again:");

button.dispatchEvent("click", {
    message: "Second button click"
});




console.log("\n===== SCENARIO C =====");
console.log("Removing button listener:");

button.removeEventListener("click", buttonClickHandler);

console.log("Clicking button again:");

button.dispatchEvent("click", {
    message: "Third button click"
});


console.log("\n===== KEYPRESS EVENT =====");

function keypressHandler(event) {
    console.log(
        `keypress handler | target: ${event.target.name} | currentTarget: ${event.currentTarget.name}`
    );

    console.log(`Key pressed: ${event.data.key}`);
}

form.addEventListener("keypress", keypressHandler);

console.log("Dispatching keypress on form:");

form.dispatchEvent("keypress", {
    key: "Enter"
});