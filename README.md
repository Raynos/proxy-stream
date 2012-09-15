# proxy-stream

Create a wrapped stream

## Example

```
var proxy = require("proxy-stream")
    , through = require("through-stream")

function map(stream, iterator) {
    return proxy(stream, write, read, stream.end, [pipeWrite])

    function write(chunk) {
        return stream.write(iterator(chunk))
    }

    function read(bytes) {
        var chunk = stream.read(bytes)
        return chunk === null ? null : iterator(chunk)
    }

    function pipeWrite(chunk, buffer) {
        buffer.push(iterator(chunk))
    }
}
```

Proxy stream is used to create a new stream based on another stream. 

It's mainly used as a building block for reduce / map / filter

## Installation

`npm install proxy-stream`

## Contributors

 - Raynos

## MIT Licenced