# What is this?

A small server used for syncing up data between multiple processes. Set, get, and delete JSON data using requests.

# How do I install it?

Install Deno if you haven't:
```sh
curl -fsSL https://deno.land/install.sh | sh
```

Then install sss:
```sh
deno install -n sss -Afg https://esm.sh/gh/jeff-hykin/simple_sharing_server@0.0.1.0/main.js
```

## How do I use it?

Serve your directory

```s
sss --port 7070 --address 127.0.0.1 # defaults
```

Once the server is running, you can use the following endpoints (more examples below):

- `http://127.0.0.1:7070/@ping` to check if the server is (still) running
- `http://127.0.0.1:7070/@shutdown` to shutdown the server
- `http://127.0.0.1:7070/attribute1/subAttribue/` to get the `state.attribute1.subAttribue` value
- `http://127.0.0.1:7070/attribute1/subAttribue/` (POST) to overwrite the value of `state.attribute1.subAttribue` (works evern if `state.attribute1` is NOT an object)
- `http://127.0.0.1:7070/attribute1/subAttribue/` (PUT) to merge the `state.attribute1.subAttribue` value recursively
- `http://127.0.0.1:7070/attribute1/subAttribue/` (DELETE) to delete the `state.attribute1.subAttribue` value

### Python Example

```py
import requests
import json

process1_height = 100
process1_width = 200

# 
# 
# Setter examples
# 
# 

# 
# setter state.process1 to {height: 100, width: 200}
# 
keys = ["process1"]
encoded_keys = "/".join(map(lambda x: requests.utils.quote(x), keys))
url = f"http://127.0.0.1:7070/{encoded_keys}"
response = requests.post(
    url,
    data=json.dumps({
        "height": process1_height,
        "width": process1_width,
    }),
    headers={
        "Content-Type": "application/json",
    }
)
data = response.json()
print(f"server response timestamp is: {data['t']}")

# 
# set state.process1.height to 100
# 
keys = ["process1", "height"]
encoded_keys = "/".join(map(lambda x: requests.utils.quote(x), keys))
url = f"http://127.0.0.1:7070/{encoded_keys}"
response = requests.post(
    url,
    data=json.dumps(process1_height),
    headers={
        "Content-Type": "application/json",
    }
)

data = response.json()
print(f"server response timestamp is: {data['t']}")

# 
# merge extra data (without overwriting process1.width)
# 
keys = ["process1", "height"]
encoded_keys = "/".join(map(lambda x: requests.utils.quote(x), keys))
url = f"http://127.0.0.1:7070/{encoded_keys}"
response = requests.put(
    url,
    data=json.dumps({
        "name": "process1",
    }),
    headers={
        "Content-Type": "application/json",
    }
)
data = response.json()
print(f"server response timestamp is: {data['t']}")

# 
# 
# Getter examples
# 
# 

# 
# get state.process1.height
# 
keys = ["process1", "height"]
encoded_keys = "/".join(map(lambda x: requests.utils.quote(x), keys))
response = requests.get(f"http://127.0.0.1:7070/{encoded_keys}")
data = response.json()
print(f"Data: {data}")
# data == {'v': 100, 't': 1662369626874}

# 
# get state.process1
# 
keys = ["process1"]
encoded_keys = "/".join(map(lambda x: requests.utils.quote(x), keys))
url = f"http://127.0.0.1:7070/{encoded_keys}"
response = requests.get(url)
data = response.json()
print(f"Data: {data}")
# data == {
#     't': 1662369626874,
#     'v': {
#         'height': 100,
#         'width': 200,
#         'name': 'process1'
#     }
# }
```

### Js Example

```js
let process1Height = 100
let process1Width = 200

// 
// setter examples
// 
    // 
    // set state.process1 to {height: 100, width: 200}
    // 
    var keys = ["process1"].map(each=>encodeURIComponent(each)).join("/")
    var responseObj = await fetch(
        `http://127.0.0.1:7070/${keys}`,
        {
            body: JSON.stringify({
                height: process1Height,
                width: process1Width,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
        }
    )
    var data = await responseObj.json()
    console.debug(`server response timestamp is:`,data.t)

    // 
    // set state.process1.height to 100
    // 
    var keys = ["process1", "height"].map(each=>encodeURIComponent(each)).join("/")
    var responseObj = await fetch(
        `http://127.0.0.1:7070/${keys}`, 
        {
            body: JSON.stringify(process1Height),
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
        }
    )
    var data = await responseObj.json()
    console.debug(`server response timestamp is:`,data.t)
    
    // 
    // merge extra data (without overwriting process1.width)
    // 
    var keys = ["process1", "height"].map(each=>encodeURIComponent(each)).join("/")
    var responseObj = await fetch(
        `http://127.0.0.1:7070/${keys}`, 
        {
            body: JSON.stringify({
                name: "process1",
            }),
            method: "PUT",
            headers: {
                "Content-Type": "application/json", 
            },
        }
    )
    var data = await responseObj.json()
    console.debug(`server response timestamp is:`,data.t)

// 
// getter examples
// 
    // get state.process1.height
    var keys = ["process1", "height"].map(each=>encodeURIComponent(each)).join("/")
    var responseObj = await fetch(`http://127.0.0.1:7070/${keys}`)
    var data = await responseObj.json()
    // data == {v: 100, t: 1662369626874}
    
    // 
    // get state.process1
    // 
    var keys = ["process1",].map(each=>encodeURIComponent(each)).join("/")
    var responseObj = await fetch(`http://127.0.0.1:7070/${keys}`)
    var data = await responseObj.json()
    // data == {
    //     t: 1662369626874,
    //     v: {
    //         height: 100,
    //         width: 200,
    //         name: "process1" 
    //     }
    // }
```

## Options

Archaeopteryx comes with a couple of options to customize your experience.

```s
--version        # Version
--help           # Help
--debug          # Debug for more verbose output - Defaults to false
```

### Directory Listing

Archaeopteryx supports indexing of served directories and provides a simple interface, with dark mode support, for navigating a project folder.

<p align="center">
  <img src="media/list.png" alt="Directory listing">
</p>

### Optional boilerplating

If the given directory doesn't exist, archaeopteryx will ask you if you want to create a boilerplate. This will generate an a basic project folder and serve it for you. Very useful to get up and running quickly.

```
├── index.html
├── index.css
├── app.js
```

### Interceptors

Archaeopteryx allows you to inject your own request interceptors to be fired before or after the HTTP requests has been handled by the server.
This can be one or more functions which have access to the request object (instance of [Deno.Request](https://doc.deno.land/builtin/stable#Request)) and gets called in the order they are defined with the output of the previous function (piped). **These functions must all return the request object.**

Interceptors can be a single function, for example:

```typescript
// before.ts

export default (req: ServerRequest) => {
  req.headers.set('Authorization', 'Bearer some-token')
  return req
}
```

or an array of functions:

```typescript
const setHeaders = (req: ServerRequest) => {
  req.headers.set('Authorization', 'Bearer some-token')
  return req
}

const logRequestUrl = (req: ServerRequest) => {
  console.log(req.url)
  return req
}

export default [setHeaders, logRequestUrl]
```

of course this can also be used when using Archaeopteryx as a module:

```typescript
import archy from "https://deno.land/x/archaeopteryx/mod.ts"

const server = archy({
  port: 6060,
  before: (req: ServerRequest) => {
    req.headers.set('Authorization', 'Bearer some-token')
    return req
  },
  // root?: string
  // port?: number
  // silent?: boolean
  // disableReload?: boolean
  // debug?: boolean
  // cors?: boolean
  // secure?: boolean
  // help?: boolean
  // dontList?: boolean
  // certFile?: string
  // keyFile?: string
  // entryPoint?: string
  // before?: string | Interceptor | Interceptor[]
  // after?: string | Interceptor | Interceptor[]
})

```

## Configuration

If you want, you can place a configuration file called `archaeopteryx.json` in the folder you are serving to avoid having to use command line arguments to customize its behaviour. By default it will look like this:

```JSON
{
  "root": ".",
  "port": 8080,
  "disableReload": false,
  "silent": false,
  "debug": false,
  "secure": false,
  "cors": false,
  "dontList": false,
  "before": "before.ts",
  "after": "after.ts",
  "certFile": "some_file.crt",
  "keyFile": "some_file.key",
  "entryPoint": "index.html"
}
```

## API

Archaeopteryx can also be used as a module in any Deno project.
This exposes an instance of [Deno.Server](https://deno.land/std/http/server.ts#L125).

The main function accepts the same config object as specified in the config file above.

```typescript
import archaeopteryx from 'https://deno.land/x/archaeopteryx/mod.ts'

const server = archaeopteryx({ port: 6060, cors: true })

server.close() // Close the server
```

## Serve over HTTPS

To use HTTPS you will need a trusted self-signed certificate. If you're on macOS you can use [This](https://github.com/kingkool68/generate-ssl-certs-for-local-development) bash script to easily generate one.

Name the cert and key files `archaeopteryx.crt` and `archaeopteryx.key` and place them in your working dir. You can configure these names to be whatever you want with the config file, or the `--certFile` and `--keyFile` flags.

## Disclaimer

**This project is not intended for production use. It started out as a way for me personally to learn Deno, and is merely a tool to quickly get a file server up and running.**

## Acknowledgements

This project was heavily inspired by [lukejacksonn](https://github.com/lukejacksonn)s fantastic [Servor](https://github.com/lukejacksonn/servor/)
