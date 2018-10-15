Node Net Benchmark
=

Usage:

All environment variables:

```sh
HOST=127.0.0.1 PORT=3301 LENGTH=100 NUMBER=100 CONNECTIONS=100 \
CONCURRENT=true VERIFY=true DEBUG=true node t1.js
```

Some interesting examples:

```sh

LENGTH=1000 NUMBER=10 CONNECTIONS=1000 node t1.js

LENGTH=1000 NUMBER=1000 CONNECTIONS=10 node t1.js

LENGTH=10 NUMBER=1000 CONNECTIONS=1000 node t1.js

```


Defaults:

* HOST=127.0.0.1
* PORT=3301
* LENGTH=100
* NUMBER=100
* CONNECTIONS=100
* CONCURRENT (false)
* VERIFY (false)
* DEBUG (false)


