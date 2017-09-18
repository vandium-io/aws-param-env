'use strict';

const awsParamEnv = require( '..' /*'aws-param-env'*/ );

awsParamEnv.load( '/services/storage-system/production/env' );

console.log( process.env );
