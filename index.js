var ReadWriteStream = require("read-write-stream")
    , reemit = require("re-emitter").reemit

module.exports = proxy

function proxy(stream, transformation, readEnd, writeEnd) {
    writeEnd = writeEnd || defaultWriteEnd
    readEnd = readEnd || defaultReadEnd

    var proxied = ReadWriteStream(write, writeEnd, read).stream
        , pipeStream

    proxied.pipe = handlePipe

    reemit(stream, proxied, ["readable", "drain"])

    stream.on("end", readEnd)

    return proxied

    function handlePipe(dest) {
        if (!pipeStream) {
            pipeStream = ReadWriteStream(writePipe).stream
            stream.pipe(pipeStream)
        }
        return pipeStream.pipe(dest)
    }

    function write(chunk, queue) {
        transformation(chunk, stream.write)
    }

    function defaultWriteEnd() {
        stream.end()
    }

    function defaultReadEnd() {
        stream.emit("end")
    }

    function read(bytes, queue) {
        var chunk = stream.read()
        if (chunk === null) {
            return null
        }

        transformation(chunk, queue.push)
        if (queue.length === 0) {
            return read(bytes, queue)
        }
        return queue.shift()
    }

    function writePipe(chunk, queue) {
        transformation(chunk, queue.push)
    }
}
