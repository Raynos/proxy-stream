var proxy = require("..")
    , from = require("read-stream").fromArray
    , to = require("write-stream").toArray

var source = map(from([1,2,3]), function (chunk) {
    return chunk * 2
})

console.log("one", source.read())
console.log("two", source.read())
console.log("three", source.read())
console.log("four", source.read())

from([1,2,3]).pipe(map(to([], function (list) {
    console.log("writable list", list)
}), function (chunk) {
    return chunk * 3
}))

var mapped = map(from([1,2,3]), function (chunk) {
        return chunk * 2
    })
    , doubleMapped = map(mapped, function (chunk) {
        return chunk * 3
    })

mapped.pipe(to([], function (list) {
    console.log("mapped", list)
}))

doubleMapped.pipe(to([], function (list) {
    console.log("double mapped", list)
}))

function map(stream, iterator) {
    return proxy(stream, transformation)

    function transformation(chunk, next) {
        next(iterator(chunk))
    }
}
