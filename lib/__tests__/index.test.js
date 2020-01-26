const { expect } = require( 'chai' );

const rewiremock = require( 'rewiremock/node' );

const envRestorer = require( 'env-restorer' );

const sinon = require( 'sinon' );

const initializerInstance = {

  execute: sinon.stub()
};

const EnvInitializerStub = sinon.stub().returns( initializerInstance );

const requireAWSParamEnv = () => {

    return rewiremock.proxy( '../index', {

      '../env': EnvInitializerStub
    });
  };

describe( 'lib/index', function() {

  beforeEach( function() {

    EnvInitializerStub.reset();
    initializerInstance.execute.reset();

    EnvInitializerStub.returns( initializerInstance );
  });

  afterEach( function() {

    envRestorer.restore();
  });

  describe( 'load', function() {

    beforeEach( function() {

      delete process.env.AWS_SSM_ENV_PATH;
    });


    it( 'without env var set', function() {

      const awsParamEnv = requireAWSParamEnv();

      expect( EnvInitializerStub.called ).to.be.false;
    });

    it( 'env var set, AWS_REGION missing', function() {

      process.env.AWS_SSM_ENV_PATH = '/my-service/env';
      delete process.env.AWS_REGION;

      const awsParamEnv = requireAWSParamEnv();

      expect( EnvInitializerStub.called ).to.be.false;
    });

    it( 'env var set, AWS_REGION set', function() {

      process.env.AWS_SSM_ENV_PATH = '/my-service/env';
      process.env.AWS_REGION = 'us-east-1';

      const awsParamEnv = requireAWSParamEnv();

      expect( EnvInitializerStub.calledOnce ).to.be.true;
      expect( EnvInitializerStub.calledWithNew() ).to.be.true;

      expect( initializerInstance.execute.calledOnce ).to.be.true;
      expect( initializerInstance.execute.firstCall.args ).to.eql( [] );
    });
  });

  describe( '.initializer', function() {

    const awsParamEnv = requireAWSParamEnv();

    it( 'normal operation', function() {

      let initializer = awsParamEnv.initializer( '/my-service/env' );

      expect( initializer ).to.equal( initializerInstance );
      expect( EnvInitializerStub.calledOnce ).to.be.true;
      expect( EnvInitializerStub.calledWithNew() ).to.be.true;
    });
  });

  describe( '.load', function() {

    const awsParamEnv = requireAWSParamEnv();

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
      expect( EnvInitializerStub.firstCall.args ).to.eql( [
          '/my-service/env',
          { region: 'us-east-1' }
        ]);

      expect( initializerInstance.execute.calledOnce ).to.be.true;
      expect( initializerInstance.execute.firstCall.args ).to.eql( [] );
    });
  });

  describe( '.envFromSSM', function() {

    const awsParamEnv = requireAWSParamEnv();

    it( 'normal operation', function() {

      expect( awsParamEnv.envFromSSM ).to.equal( awsParamEnv.load );
    });
  });
});
