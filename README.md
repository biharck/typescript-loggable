# Typescript-loggable

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

`typescript-loggable` is a tool which encapsulates [Winston][https://github.com/winstonjs/winston] making it cleaner and simple to be used.

### How to use it
```
import { Logger } from './typescript-loggable';
const logger = new Logger();
log.error('this is my error log');
```

By default, the output log will follow the template bellow:
```
2020-02-13 17:21:42 error: my first log error msg @/typescript-loggable/dist/other.js (+0ms) 
2020-02-13 17:21:42 error: ops, I did it again @/typescript-loggable/dist/other.js (+3ms) 
```
Since `typescript-loggable` uses `winston` you can pass as a parameter an winston LoggerOptions such as:
```
 const options: Winston.LoggerOptions = {
    format: Winston.format.combine(
        Winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message} (${info.ms}) `;
        })
    ),
    transports: [
        new Winston.transports.Console()
    ]
};

const logger = new Logger(options);
log.error('this is my custom error log');
```

Kuddos to https://www.npmjs.com/~trbustamante in https://www.npmjs.com/package/typescript-ioc you can inject the Logger using ioc:
```
import { Inject } from 'typescript-ioc';
import { Logger } from './typescript-loggable'

export class Server {

    @Inject
    private logger: Logger;

    public myLogger(){
        this.logger.error('error log content');
    }

}
```