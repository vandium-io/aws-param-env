'use strict';

const awsParamStore = require( 'aws-param-store' );

function getName( param ) {

    let nameParts = param.Name.split( '/' );

    let name = nameParts[ nameParts.length - 1 ];

    return name;
}

function defaultProcessor( parameter ) {

    return parameter;
}

class EnvInitializer {

    constructor( paramPath, options ) {

        this._query = awsParamStore.newQuery( paramPath, options );
    }

    execute( processor = defaultProcessor ) {

        let parameters = this._query.executeSync()

        let results = {

            added: [],
            ignored: [],
            conflict: []
        };

        for( let param of parameters ) {

            let name = getName( param );

            param = processor( param );

            if( param ) {

                // updatex
                name = getName( param );

                if( !process.env[ name ] ) {

                    process.env[ name ] = param.Value;
                    results.added.push( name );
                }
                else {

                    results.conflict.push( name );
                }
            }
            else {

                results.ignored.push( name );
            }
        }

        return results;
    }
}


module.exports = EnvInitializer;
