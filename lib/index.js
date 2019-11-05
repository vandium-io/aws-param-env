const EnvInitializer = require( './env' );

function initializer( path, options ) {

    return new EnvInitializer( path, options );
}

function load( path, options ) {

    initializer( path, options ).execute();
}

if( process.env.AWS_SSM_ENV_PATH && process.env.AWS_REGION ) {

    // load from supplied path
    load( process.env.AWS_SSM_ENV_PATH );
}

module.exports = {

    initializer,
    load,
};
