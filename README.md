# Typescript-loggable

[![npm version](https://badge.fury.io/js/typescript-loggable.svg)](https://badge.fury.io/js/typescript-loggable)
[![Build Status](https://travis-ci.org/biharck/typescript-loggable.svg?branch=master)](https://travis-ci.org/biharck/typescript-loggable)

`typescript-loggable` is a tool which encapsulates [Winston](https://github.com/winstonjs/winston) making it cleaner and simple to be used.

### Usage
```
import { Logger } from 'typescript-loggable';

const logger = new Logger();
logger.error('this is my error log');
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