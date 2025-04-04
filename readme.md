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