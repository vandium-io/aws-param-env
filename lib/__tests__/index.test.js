/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/index', function() {

    let initializerInstance = {};

    let EnvInitializerStub;

    beforeEach( function() {

        EnvInitializerStub = sinon.stub().returns( initializerInstance );
    });

    describe( 'load', function() {

        afterEach( function() {

            delete process.env.AWS_SSM_ENV_PATH;
        });

        it( 'without env var set', function() {

            delete process.env.AWS_SSM_ENV_PATH;

            const awsParamEnv = proxyquire( '../index', {

                './env': EnvInitializerStub
            });

            expect( EnvInitializerStub.called ).to.be.false;
        });

        it( 'env var set, AWS_REGION missing', function() {

            process.env.AWS_SSM_ENV_PATH = '/my-service/env';
            delete process.env.AWS_REGION;

            awsParamEnv = proxyquire( '../index', {

                './env': EnvInitializerStub
            });

            expect( EnvInitializerStub.called ).to.be.false;
        });

        it( 'env var set, AWS_REGION set', function() {

            process.env.AWS_SSM_ENV_PATH = '/my-service/env';
            process.env.AWS_REGION = 'us-east-1';

            initializerInstance.execute = sinon.stub();

            awsParamEnv = proxyquire( '../index', {

                './env': EnvInitializerStub
            });

            expect( EnvInitializerStub.calledOnce ).to.be.true;
            expect( EnvInitializerStub.calledWithNew() ).to.be.true;

            expect( initializerInstance.execute.calledOnce ).to.be.true;
            expect( initializerInstance.execute.firstCall.args ).to.eql( [] );
        });
    });

    describe( '.initializer', function() {

        let awsParamEnv;

        beforeEach( function() {

            awsParamEnv = proxyquire( '../index', {

                './env': EnvInitializerStub
            });
        });

        it( 'normal operation', function() {

            let initializer = awsParamEnv.initializer( '/my-service/env' );

            expect( initializer ).to.equal( initializerInstance );
            expect( EnvInitializerStub.calledOnce ).to.be.true;
            expect( EnvInitializerStub.calledWithNew() ).to.be.true;
        });
    });

    describe( '.load', function() {

        let awsParamEnv;

        beforeEach( function() {

            awsParamEnv = proxyquire( '../index', {

                './env': EnvInitializerStub
            });
        });

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
