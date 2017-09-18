'use strict';

const EnvInitializer = require( './env' );

function initializer( path ) {

    return new EnvInitializer( path );
}

function load( path ) {

    new EnvInitializer( path ).execute();
}

module.exports = {

    initializer,
    load
};
