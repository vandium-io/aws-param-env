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
});
