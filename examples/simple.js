'use strict';

const awsParamEnv = require( '..' /*'aws-param-env'*/ );

awsParamEnv.initializer( '/services/storage-system/production/env' ).execute();

console.log( process.env );
