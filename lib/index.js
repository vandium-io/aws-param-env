'use strict';

const EnvInitializer = require( './env' );

function initializer( path, options ) {

    return new EnvInitializer( path, options );
}

function load( path, options ) {

    initializer( path, options ).execute();
}

module.exports = {

    initializer,
    load
};
