# Typescript-loggable

[![npm version](https://badge.fury.io/js/typescript-loggable.svg)](https://badge.fury.io/js/typescript-loggable)
[![Build Status](https://travis-ci.org/biharck/typescript-loggable.svg?branch=master)](https://travis-ci.org/biharck/typescript-loggable)

`typescript-loggable` is a tool which encapsulates [Winston](https://github.com/winstonjs/winston) making it cleaner and simple to be used.

### Usage
```
import { Logger } from 'typescript-loggable';

const logger = Logger.getInstance();
logger.error('this is my error log');
```

By default, the output log will follow the template bellow:
```
2020-02-13 17:21:42 error: my first log error msg (+0ms) 
2020-02-13 17:21:42 error: ops, I did it again (+3ms) 
```

In order to get who called the log method, enable the feature showCaller:
```
logger.getInstance().showCaller = true;
```

and the output will be:
```
2020-02-13 17:21:42 error: my first log error msg @/typescript-loggable/dist/other.js (+0ms)
```

Since `typescript-loggable` makes use of `winston` you can pass as a parameter an winston LoggerOptions such as:
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

const logger = Logger.getInstance().loggerOptions = options;
log.error('this is my custom error log');
```

You can also inject the logger using [typescript-ioc](https://www.npmjs.com/package/typescript-ioc) (Kudos to [Thiago Bustamante](https://www.npmjs.com/~trbustamante)):

```
import { Inject } from 'typescript-ioc';
import { Logger } from 'typescript-loggable'

export class MyLogClass {

    @Inject
    private logger: Logger;

    public myLogger(){
        this.logger.error('error log content');
    }

}
```