var GoogleAuth = require('google-auth-library');
var fs = require('fs');

function AuthClient ( ) {
  this._authFactory = new GoogleAuth();
  this.authClient = null;
  this._projectId = null;
  this._sourceContext = null;

  this._getApplicationDefaultCredentials();
  this._aquireProjectId();

}

AuthClient.prototype._getApplicationDefaultCredentials = function ( ) {

  this._authFactory.getApplicationDefault(
    ( err, authClient ) => {
      var scopes = ['https://www.googleapis.com/auth/cloud-platform'];

      if ( err ) {
        console.log("Authentication failed because of", err);

        return ;
      }


      if ( authClient.createScopedRequired && authClient.createScopedRequired() ) {

        this.authClient = authClient.createScoped(scopes);
      } else {

        this.authClient = authClient;
      }
    }
  );
}

AuthClient.prototype._aquireProjectId = function ( ) {

  try {

    this._sourceContext = JSON.parse(fs.readFileSync('./source-context.json'));
    this._projectId = this._sourceContext.cloudRepo.repoId.projectRepoId.projectId;
  } catch ( e ) {

    if ( process.env.GCLOUD_PROJECT ) {

      this._projectId = process.env.GCLOUD_PROJECT;
    } else {

      console.log("Could not find project information, unable to use error api");
    }
  }
}

AuthClient.prototype.request = function ( options, callback ) {

  this.authClient.request(options, callback);
}

AuthClient.prototype._encodeGetErrorsUrlParams = function ( options ) {

  return "?groupId="+options.groupId+"&timeRange.period="+options.timeRange;
}

AuthClient.prototype.getErrors = function ( options, callback ) {

  var requestOpts = Object.assign(
    {
      url: [
        "https://clouderrorreporting.googleapis.com/v1beta1/projects"
        , this._projectId
        , "events"
      ].join("/")+this._encodeGetErrorsUrlParams(options)
      , method: "GET"
    }
    , options
  );

  this.authClient.request(requestOpts, callback);
}

module.exports = AuthClient;
