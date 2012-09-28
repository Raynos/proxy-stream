# proxy-stream

Create a wrapped stream

## Example

```
var proxy = require("proxy-stream")

function map(stream, iterator) {
    return proxy(stream, function transformation(chunk, next) {
        next(iterator(chunk))
    })
}
```

Proxy stream is used to create a new stream based on another stream.

It's mainly used as a building block for reduce / map / filter

## Installation

`npm install proxy-stream`

## Contributors

 - Raynos

## MIT Licenced
