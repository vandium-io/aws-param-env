/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/index', function() {

    let initializerInstance = {};

    let EnvInitializerStub;

    let awsParamEnv;

    beforeEach( function() {

        EnvInitializerStub = sinon.stub().returns( initializerInstance );

        awsParamEnv = proxyquire( '../../lib/index', {

            './env': EnvInitializerStub
        });
    });

    describe( '.initializer', function() {

        it( 'normal operation', function() {

            let initializer = awsParamEnv.initializer( '/my-service/env' );

            expect( initializer ).to.equal( initializerInstance );
            expect( EnvInitializerStub.calledOnce ).to.be.true;
            expect( EnvInitializerStub.calledWithNew() ).to.be.true;
        });
    });

    describe( '.load', function() {

        it( 'normal operation', function() {

            initializerInstance.execute = sinon.stub();

            awsParamEnv.load( '/my-service/env' );

            expect( EnvInitializerStub.calledOnce ).to.be.true;
            expect( EnvInitializerStub.calledWithNew() ).to.be.true;

            expect( initializerInstance.execute.calledOnce ).to.be.true;
            expect( initializerInstance.execute.firstCall.args ).to.eql( [] );
        });

        it( 'with options', function() {

            initializerInstance.execute = sinon.stub();

            awsParamEnv.load( '/my-service/env', { region: 'us-east-1' } );

            expect( EnvInitializerStub.calledOnce ).to.be.true;
            expect( EnvInitializerStub.calledWithNew() ).to.be.true;
            expect( EnvInitializerStub.firstCall.args ).to.eql( [ '/my-service/env', { region: 'us-east-1' } ] );

            expect( initializerInstance.execute.calledOnce ).to.be.true;
            expect( initializerInstance.execute.firstCall.args ).to.eql( [] );
        });
    });
});
