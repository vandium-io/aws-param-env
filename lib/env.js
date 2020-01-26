const { getParametersByPathSync } = require( 'aws-param-store' );

function getName( param ) {

  return param.Name.split( '/' ).pop();
}

class EnvInitializer {

  constructor( paramPath, options ) {

    this.paramPath = paramPath;
    this.options = options;
  }

  execute( processor = ( parameter ) => parameter ) {

    const parameters = getParametersByPathSync( this.paramPath, this.options );

    const results = {

      added: [],
      ignored: [],
      conflict: []
    };

    parameters.forEach( (param) => {

      let name = getName( param );

      param = processor( param );

      if( param ) {

        // update
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
    });

    return results;
  }
}


module.exports = EnvInitializer;
