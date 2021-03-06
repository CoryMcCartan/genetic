/*
 * JavaScript Genetic Algorithm
 *
 * ©2016 Cory McCartan
 */

(function() {
    "use strict";

    // figure out the root object -- window if in browser, global if server, etc.
    let root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    let err = function(e) {
        throw e;
    };

    /**
     * Genetic Optimizer.
     *
     * @param options {object} options for the optimizer 
     *   @param options.length {Number} the length of the chromosome
     *   @param options.radix {Number} the base used  to encode the data
     *   @param options.fitness {Function} the fitness function (passed an
     *   individual, return a number)
     *   @param options.size {Number} the number of individuals in the population.
     *   MUST BE AN EVEN NUMBER.
     *   @param options.children {Number} the number of children each pair should
     *   produce. Default is 4.
     *   @param options.mutationRate {Number} the mutation rate, in mutations/base
     *   pair.  Default is 0.05.
     *   @param options.crossovers {Number} the number of crossovers per generation
     *   (some randomness will be applied).  Default is 1.
     */
    let JSGA = function(options) {
        let length = options.length || err("Expected length parameter.");
        let radix = options.radix || err("Expected radix parameter.");
        let fitness = options.fitness || err("Expected fitness parameter.");
        let size = options.size || err("Expected size parameter.");
        let children = options.children || 4;
        let mutationRate = options.mutationRate || 0.05;
        let crossovers = options.crossovers || 1;

        let self = {};

        if (size % 2 != 0) size++; // make size even

        let population = [];
        let offspring = [];
        
        /**
         * Run the algorithm
         * @param generations {Number} the number of generations to run
         */
        self.run = function* (generations) {		
            // fill population with random chromosomes
            for (let i = 0; i < size; i++) {
                population.push([...randInt(radix, length)]);
            }
            
            // for every generation
            for (let i = 0; i !== generations; i++) {
                reproduce();
                select();

                yield {
                    generation: i,
                    population,
                    best: {
                        params: population[0],
                        fitness: fitness(population[0])
                    }
                };
            }
        };
        
        let reproduce = function() {
            let pairings = new Set();
            
            // randomly generate pairings
            let randomPair = randInt(size);
            while (pairings.size < size) {
                pairings.add(randomPair.next().value);
            }
            pairings = Array.from(pairings);
            
            // create offspring
            for (let i = 0; i < size; i += 2) {
                let parentA = population[pairings[i]];
                let parentB = population[pairings[i+1]];
                
                for (let j = 0; j < children; j++) {
                    let optA = parentA.slice(); // make a copy of each
                    let optB = parentB.slice();

                    // crossover
                    for (let point of randInt(length, crossovers)) {
                        optA = optA.slice(0, point).concat(optB.slice(point));
                        optB = optB.slice(0, point).concat(optA.slice(point));
                    }

                    let child = Math.random() > 0.5 ? optA : optB;
                    
                    // mutate
                    let randomMutation = randInt(radix);
                    for (let k = 0; k < length; k++) {
                        if (Math.random() < mutationRate) {
                            child[k] = randomMutation.next().value;
                        }
                    }
                    
                    offspring.push({
                        child, 
                        fitness: fitness(child)
                    });
                }
            }

            // let the single best parent carry over, to maintain good solutions
            offspring.push({
                child: population[0],
                fitness: fitness(population[0])
            }); 
        };
        
        // natural selection
        let select = function() {
            offspring.sort((a, b) => b.fitness - a.fitness);
            population = offspring.map(i => i.child).slice(0, size);

            offspring = [];
        };
        
        /**
         * Generate array of gray codes. Utility function.
         * @param n {Number} length of code
         * @param k {Number} base (=length if not specified)
         */
        self.gray = function* (n, k) {
            k = k || 2;
            if (n <= 0) return [];
            
            let max = Math.pow(k, n);
            
            for (let i = 0; i < max; i++) {
                let res = [];
                let shift = 0;
                
                for (let j = n - 1; j >= 0; j--) {
                    let x = (digit(i, k, j) + shift) % k;
                    shift += k - x;
                    res.push(x);
                }

                yield res;
            }
        };

        var randInt = function* (max, n) {
            n = n || -1;
            let i = 0;
            while (i++ != n) {
                yield ~~(Math.random() * max); 
            }
        };
        
        
        return self;
    };

    JSGA.VERSION = "1.0.0";

    // export the object for Node and the browser.
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = JSGA;
        }
        exports.JSGA = JSGA;
    } else {
        root.JSGA = JSGA;
    }
})();
