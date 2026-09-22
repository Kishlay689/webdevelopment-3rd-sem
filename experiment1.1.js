const EventEmitter =require('events'); 
const myEmitter =new EventEmitter();

myEmitter.on('greet',(name)=> {
console.log(`Hello,${name}! welcome to Node.js.`);
});

myEmitter.on('exit',()=>{
    console.log("application closed.");
});

myEmitter.emit('greet','Kishlay');
myEmitter.emit('exit');