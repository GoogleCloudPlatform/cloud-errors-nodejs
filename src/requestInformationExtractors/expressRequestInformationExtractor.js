function extractRemoteAddressFromRequest ( req ) {

  if ( req.header('x-forwarded-for') !== undefined ) {

    return req.header('x-forwarded-for');
  } else if ( req.connection && ((typeof req.connection) === 'object') ) {

    return req.connection.remoteAddress;
  }

  return "";
}

function expressRequestInformationExtractor ( req ) {

  var returnObject = {
    method: ""
    , url: ""
    , userAgent: ""
    , referrer: ""
    , statusCode: 0
    , remoteAddress: ""
  };

  if ( !req || ((typeof req) !== 'object')
    || ((typeof req.header) !== 'function') ) {

      return returnObject;
  }

  returnObject.method = req.method;
  returnObject.url = req.url;
  returnObject.userAgent = req.header('user-agent');
  returnObject.referrer = req.header('referrer');
  returnObject.statusCode = req.statusCode;
  returnObject.remoteAddress = extractRemoteAddressFromRequest(req);

  return returnObject;
}

module.exports = expressRequestInformationExtractor;
