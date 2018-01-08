'use strict';

const awsParamEnv = require( '..' /*'aws-param-env'*/ );

awsParamEnv.load( '/services/storage-system/production/env', { region: 'us-east-1' } );

console.log( process.env );
