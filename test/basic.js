#!/usr/bin/env -S deno run --allow-all

setInterval(async () => {
    try {
        let times = []
        const mainStart = performance.now()
        console.log(`start ${Date.now()}`)
        while (1) {
            let start = performance.now()
            // console.log(`setting data on api/endpoint`)
            // console.log(
                await fetch("http://127.0.0.1:7070/api/endpoint", {
                    method: "POST", // Specify the request method
                    headers: {
                        "Content-Type": "application/json", // Specify the content type as JSON
                    },
                    body: JSON.stringify({
                        key1: "value1", // Your data to be sent
                        key2: "value2",
                    }),
                }).then((response) => response.json())
            // )

            // console.log(`getting data on api/`)
            // console.log(
                await fetch("http://127.0.0.1:7070/api/", {
                    method: "GET", // Specify the request method
                    // headers: {
                    //     "Content-Type": "application/json", // Specify the content type as JSON
                    // },
                    // body: JSON.stringify({
                    //     key1: "value1", // Your data to be sent
                    //     key2: "value2",
                    // }),
                }).then((response) => response.json())
            // )
            const end = performance.now()
            times.push(end-start)
            if (end-mainStart>1000) {
                break
            }
        }
        console.log(`end ${Date.now()}`)
        // console.debug(`JSON.stringify(times)`,JSON.stringify(times,0,4))
        console.debug(`times.length is:`,times.length)
    } catch (error) {
        console.debug(`error is:`,error)
    }
}, 5000)