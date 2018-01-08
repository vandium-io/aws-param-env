[![Build Status](https://travis-ci.org/vandium-io/aws-param-env.svg?branch=master)](https://travis-ci.org/vandium-io/aws-param-env)
[![npm version](https://badge.fury.io/js/aws-param-env.svg)](https://badge.fury.io/js/aws-param-env)

# aws-param-env

Module for loading parameter-store values from AWS SSM into environment variables

## Features
* Loads parameters by path
* Runs synchronously to that environment variables can be set before your code loads
* Recursively loads and decodes parameters by default
* Can run inside AWS Lambda environment
* AWS Lambda Node.js 6.10.x compatible

## Installation
Install via npm.

	npm install aws-param-env --save

**Note**: `aws-param-env` does not contain a dependency on `aws-sdk` and it should be installed within your application.

## Getting Started

```js
const awsParamEnv = require( 'aws-param-env' );

awsParamEnv.load( '/my-service-path-in-ssm/env' );
```

If your AWS region is not set in your environment variables, then it can be set programmatically by supplying
options when calling `load()`:

```js
const awsParamEnv = require( 'aws-param-env' );

awsParamEnv.load( '/my-service-path-in-ssm/env', { region: 'us-east-1' } );
```


## Feedback

We'd love to get feedback on how to make this tool better. Feel free to contact us at `feedback@vandium.io`

## License

[BSD-3-Clause](https://en.wikipedia.org/wiki/BSD_licenses)
