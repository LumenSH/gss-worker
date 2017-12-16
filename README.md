GSS Worker
---
Simple worker which executes pre defined commands on AMQP message

Installation
---
Install all dependencies using ``npm i``

After installing all dependencies, update your AMQP config in package.json
```
"amqp": {
    "host": "localhost",
    "port": 5672,
    "login": "",
    "password": ""
}
```
Update your credentials and run ``node . run`` or ``node . -d run`` for debug mode and more informations.
