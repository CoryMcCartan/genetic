"use strict";

let JSGA = require("./jsga.js");

let algorithm = JSGA({
    length: 10,
    radix: 10,
    fitness: m => m.reduce((p, c) => p + c),
    size: 50
});

for (let generation of algorithm.run(50)) {
    console.log(generation.best.params);
}
