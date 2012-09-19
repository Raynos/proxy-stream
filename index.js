var through = require("through-stream")
    , reemit = require("re-emitter").reemit

module.exports = proxy

function proxy(stream, write, read, end, pipe) {
    var proxied = through(write, read, end)
        , pipeStream

    if (pipe) {
        proxied.pipe = handlePipe
    }

    proxied.writable = stream.writable
    proxied.readable = stream.readable

    reemit(stream, proxied, ["readable", "drain", "end"])

    return proxied

    function handlePipe(dest) {
        if (!pipeStream) {
            pipeStream = through.apply(null, pipe)
            stream.pipe(pipeStream)
        }
        pipeStream.pipe(dest)
        return dest
    }
}