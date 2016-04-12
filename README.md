# JSGA
## JavaScript Genetic Algorithm

JSGA is an ES6 genetic algorithm library.

## Installation

- Bower: `bower install jsga`

Or you can download `jsga.js` above.

## Usage

JSGA operates on chromosomes --- lists of numbers.  It generates successive
generations of chromosomes by mixing the chromosomes of randomly selected parents,
and by randomly mutating chromosomes.  It evaluates each individual  by using a 
user-provided fitness function.  Only the fittest individuals from each generation
are carried over to the next.

Start by creating a JSGA object:

```javascript
let algorithm = JSGA({
    length: 10,
    radix: 10,
    fitness: function(individual) {
        return individual.reduce((p, c) => p + c); // the fitness is the sum of all the values
    },
    size: 100,
    children: 4,
    mutationRate: 0.05,
    crossovers: 1
});
```

Notes on the parameters:

- `length` is the length of the chromosome.
- `radix` is the 'base' used to encode the data.  Each number in the chromosome
  will have a range from `0` to `radix`.
- `fitness` is the fitness function used to evaluate individuals.  It is passed
  a chromosome (array of numbers) and expects a number to be returned.  JSGA
  will try to maximize the fitness function.
- `size` is the number of individuals in the population.  This must be an even number.
- `children` is the number of offsping each pair of parents will produce.  The 
default is 4.
- `mutationRate` is the rate of random mutations, in mutations/number.  That
  is, for the default mutation rate of 0.05, around one in every twenty numbers
  in each chromosome will be randomly mutated.
- `crossovers` is the number of times to randomly cross over the parents
  chromosomes.  This is the primary source of variation.  The default is 1.


To run the algorithm, simply call the `run` method with the number of
generations to run the algorithm. Pass `-1` to make the algorithm run forever.
`run` is a generator which yields an object containing information about the
current generation.

```javascript
for (let generation of algorithm.run(50)) {
    console.log(`Generation ${generation.generation}`);
    console.log(`Array of individuals: ${generation.population}`);
    console.log(`Best individual: ${generation.best.params}`);
    console.log(`Best individual's fitness: ${generation.best.fitness}`);
}
```
