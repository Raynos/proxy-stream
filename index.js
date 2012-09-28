var ReadWriteStream = require("read-write-stream")
    , reemit = require("re-emitter").reemit

module.exports = proxy

function proxy(stream, transformation) {
    var proxied = ReadWriteStream(write, end, read).stream
        , pipeStream

    proxied.pipe = handlePipe

    reemit(stream, proxied, ["readable", "drain", "end"])

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

    function end() {
        stream.end()
    }

    function read(bytes, queue) {
        var chunk = stream.read()
        if (chunk === null) {
            return null
        }

        transformation(chunk, queue.push)
        return queue.shift()
    }

    function writePipe(chunk, queue) {
        transformation(chunk, queue.push)
    }
}
