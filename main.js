#!/usr/bin/env -S deno run --allow-all
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import { parseArgs, flag, required, initialValue } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.3.0/source/flattened/parse_args.js"
import { didYouMean } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.3.0/source/flattened/did_you_mean.js"

const argsInfo = parseArgs({
    rawArgs: Deno.args,
    fields: [
        [["--help", ], flag, ],
        [["--version", ], flag, ],
        [["--debug", "-d", ], flag, ],
        [["--port"], initialValue(`7070`), (str)=>str],
        [["--address"], initialValue(`0.0.0.0`), (str)=>str],
        [["--overrideAddressCheck", ], flag, ],
        [["--noFallbackPort", ], flag, ],
    ],
    namedArgsStopper: "--",
    allowNameRepeats: true,
    valueTransformer: JSON.parse,
    isolateArgsAfterStopper: false,
    argsByNameSatisfiesNumberedArg: true,
    implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
    implictFlagPattern: null,
})
didYouMean({
    givenWords: Object.keys(argsInfo.implicitArgsByName).filter(each=>each.startsWith(`-`)),
    possibleWords: Object.keys(argsInfo.explicitArgsByName).filter(each=>each.startsWith(`-`)),
    autoThrow: true,
    suggestionLimit: 1,
})
let {help, version, debug, port, address, overrideAddressCheck, noFallbackPort} = argsInfo.simplifiedNames
if (help) {
    console.log(`
    Usage: sss
    
    Options:
        --help, -h
            Show this help message and exit.
        --version, -v
            Show version and exit.
        --debug, -d
            Enable debug mode.
        --port, -p
            Default port to use for the server (defaults to 7070)
            (it will increment up by 1 until it finds an available port up to 10000)
        --address, -a
            Address to use for the server.
            Defaults to 127.0.0.1
    `)
    Deno.exit(0)
}
if (version) {
    console.log(`0.0.1`)
    Deno.exit(0)
}


let shouldWarn = true
let browserPromise
let abortController
let addr
let server
let stringForPdfExtractionHtml
let serverRunningPromise
let pagePromise
let hostIp = address


// 
// host ip
// 
    if (!overrideAddressCheck) {
        const hostIps = Deno.networkInterfaces()
            .filter((each) => each.family == "IPv4")
            .map((each) => each.address)
            // first ip is usually 127.0.0.1 (localhost)
        if (hostIps.length == 0) {
            throw new Error(`No valid network interfaces found (I listed all available ip addresses, and it was empty according to Deno.networkInterfaces)\nUse --overrideAddressCheck to override this check`)
        }
        if (hostIp != "localhost" && !hostIps.some(each=>each==hostIp)) {
            hostIp = hostIps[0]
            if (shouldWarn) {
                console.warn(`The selected ${address} is not a valid ip, valid addresses are\n${JSON.stringify(hostIps)}\nFalling back on ${hostIp}\nUse --overrideAddressCheck to override this behavior / check`)
            }
        }
    } 

// 
// start server
// 
import { merge } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/merge.js'
import { get } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/get.js'
import { set } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/set.js'
import { remove } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/remove.js'

let state = {}
const returnJson = (value)=>{
    return new Response(
        JSON.stringify(value),
        { headers: { "Content-Type": "application/json" } }
    )
}
const getKeyList = (url)=>{
    url = new URL(url)
    let pathname = url.pathname
    if (pathname == "/"||pathname.length==0) {
        return []
    }
    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0,-1)
    }
    if (pathname.startsWith("/")) {
        pathname = pathname.slice(1)
    }
    return pathname.split("/").map(decodeURIComponent)
}
while (port < 10000) {
    try {
        addr = `${hostIp}:${port}`
        server = Deno.serve(
            {
                port: port,
                hostname: hostIp,
                onListen: ()=>{
                    console.log(`Server listening on http://${addr}`)
                },
            },
            // (req) => new Response(stringForPdfExtractionHtml, { headers: { "Content-Type": "text/html" } }),
            async (req) => {
                // startup check
                if (req.url?.endsWith?.("/@ping")) {
                    return new Response("pong")
                }
                if (req.url?.endsWith?.("/@shutdown")) {
                    Deno.exit(0)
                }
                // 
                // read
                // 
                if (req.method == "GET") {
                    // path
                    const keyList = getKeyList(req.url)
                    if (keyList.length==0){
                        return returnJson({ t: Date.now(), v: state, })
                    }
                    const output = get({from: state, keyList, failValue: null})
                    return returnJson({ t: Date.now(), v: output, })
                // 
                // write
                // 
                } else if (req.method == "POST") {
                    let value
                    try {
                        value = await req.json()
                    } catch (error) {
                        return new Response(`Request needs to be json, but was not (happened during ${req.url})`, { status: 405 })
                    }
                    // path
                    const keyList = getKeyList(req.url)
                    set({on: state, keyList, to: value})
                    return returnJson({ t: Date.now(), })
                } else if (req.method == "PUT") {
                    let value
                    try {
                        value = await req.json()
                    } catch (error) {
                        return new Response(`Request needs to be json, but was not (happened during ${req.url})`, { status: 405 })
                    }
                    // path
                    const keyList = getKeyList(req.url)
                    let existingValue
                    const needToMerge = (value instanceof Object) && ((existingValue=get({from: state, keyList, failValue: null})) instanceof Object)
                    if (needToMerge) {
                        value = merge({ oldData: existingValue, newData: value })
                    }
                    set({on: state, keyList, to: value})
                    return returnJson({ t: Date.now(), })
                } else if (req.method == "DELETE") {
                    remove({from: state, keyList})
                    return returnJson({ t: Date.now(), })
                } else {
                    return new Response(`Method not allowed (${req.method})`, { status: 405 })
                }
            },
        )
        break
    } catch (error) {
        if (!error.stack.includes("AddrInUse: Address already in use (os error 48)")) {
            throw error
        } else {
            if (noFallbackPort) {
                throw error
            }
            shouldWarn && console.warn(`error when trying to start server on port ${port}, trying next port`, error)
        }
        port++
    }
}
if (port >= 10000) {
    throw new Error(`giving up, tried every port and couldn't start server`)
}
await new Promise(async (resolve, reject)=>{
    while (1) {
        try {
            const response = await (await fetch(`http://${addr}/@ping`)).text()
            if (response == "pong") {
                resolve()
            }
        } catch (error) {}
        break
    }
})
console.log(`Server ready`)