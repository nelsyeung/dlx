# DLX

> Knuth's Algorithm X using Dancing Links written with ES6. The solver code are
> commented to match the original paper to make it easier to learn and
> understand.

## Getting started

```sh
npm install @nelsyeung/dlx
```

## Usage

```js
import dlx from 'dlx';

const matrix = [
  [0, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 1],
];

const solution = dlx(matrix);
```

## License
[MIT license](http://opensource.org/licenses/MIT.php)
