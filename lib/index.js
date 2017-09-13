'use strict';

const EnvInitializer = require( './env' );

function initializer( path ) {

    return new EnvInitializer( path );
}

module.exports = {

    initializer
};
