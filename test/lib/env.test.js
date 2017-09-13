/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

const envRestorer = require( 'env-restorer' );

describe( 'lib/env', function() {

    let EnvInitializer;

    let awsParamStoreStub;

    let queryInstance;

    beforeEach( function() {

        queryInstance = {

            executeSync: sinon.stub().returns( [] )
        };

        awsParamStoreStub = {

            newQuery: sinon.stub().returns( queryInstance )
        };

        EnvInitializer = proxyquire( '../../lib/env', {

            'aws-param-store': awsParamStoreStub
        });
    });

    afterEach( function() {

        envRestorer.restore();
    });

    describe( 'EnvInitializer', function() {

        describe( 'constructor', function() {

            it( 'normal operation', function() {

                let instance = new EnvInitializer( '/my-service/env' );

                expect( awsParamStoreStub.newQuery.calledOnce ).to.be.true;
                expect( awsParamStoreStub.newQuery.firstCall.args ).to.eql( [ '/my-service/env' ] );
            });
        });

        describe( '.execute', function() {

            it( 'normal operation', function() {

                queryInstance.executeSync.returns( [
                        { Name: '/my-service/env/Param1', Value: 'Value1' },
                        { Name: '/my-service/env/Param2', Value: 'Value2' },
                        { Name: '/my-service/env/Param3', Value: 'Value3Conflict' }
                    ]);

                expect( process.env.Param1 ).to.not.exist;
                expect( process.env.Param2 ).to.not.exist;

                process.env.Param3 = 'Value3';

                let results = new EnvInitializer( '/my-service/env' ).execute();

                expect( process.env.Param1 ).to.exist;
                expect( process.env.Param1 ).to.equal( 'Value1' );
                expect( process.env.Param2 ).to.exist;
                expect( process.env.Param2 ).to.equal( 'Value2' );

                expect( results ).to.eql( { added: [ 'Param1', 'Param2' ], ignored: [], conflict: [ 'Param3' ] } );
            });

            it( 'custom processor', function() {

                queryInstance.executeSync.returns( [
                        { Name: '/my-service/env/param1', Value: 'Value1' },
                        { Name: '/my-service/env/param2', Value: 'Value2' },
                        { Name: '/my-service/env/x-param3', Value: 'Value3' }
                    ]);

                expect( process.env.Param1 ).to.not.exist;
                expect( process.env.Param2 ).to.not.exist;
                expect( process.env.Param3 ).to.not.exist;

                let results = new EnvInitializer( '/my-service/env' ).execute( (param) => {

                        if( param.Name.indexOf( 'x-' ) > 0 ) {

                            // ignore
                            return null;
                        }

                        param.Name = param.Name.toUpperCase();

                        return param;
                    });

                expect( process.env.PARAM1 ).to.exist;
                expect( process.env.PARAM1 ).to.equal( 'Value1' );
                expect( process.env.PARAM2 ).to.exist;
                expect( process.env.PARAM2 ).to.equal( 'Value2' );
                expect( process.env[ 'X-PARAM3' ] ).to.not.exist;

                expect( results ).to.eql( { added: [ 'PARAM1', 'PARAM2' ], ignored: [ 'x-param3' ], conflict: [] } );
            });


            it( 'normal operation, no parameters', function() {

                let results = new EnvInitializer( '/my-service/env' ).execute();

                expect( results ).to.eql( { added: [], ignored: [], conflict: [] } );
            });
        });
    });
});
