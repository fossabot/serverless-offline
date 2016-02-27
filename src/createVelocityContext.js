'use strict';

const base64Encode = require('btoa');
const base64Decode = require('atob');
const escapeJavaScript = require('js-string-escape');

/*
This function return a context object that mocks APIG mapping template reference
http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/
module.exports = function createVelocityContext(request, options) {
  
  options = options || {};
  options.authorizer = options.authorizer || {};
  options.identity = options.identity || {};
  options.stageVariables = options.stageVariables || {};
  
  return {
    context: {
      apiId: options.apiId || 'offlineContext_apiId',
      authorizer: {
        principalId: options.authorizer.principalId || 'offlineContext_authorizer_principalId',
      },
      httpMethod: request.method.toUpperCase(),
      identity: {
        accountId: options.identity.accountId || 'offlineContext_accountId',
        apiKey: options.identity.apiKey || 'offlineContext_apiKey',
        caller: options.identity.caller || 'offlineContext_caller',
        cognitoAuthenticationProvider: options.identity.cognitoAuthenticationProvider || 'offlineContext_cognitoAuthenticationProvider',
        cognitoAuthenticationType: options.identity.cognitoAuthenticationType || 'offlineContext_cognitoAuthenticationType',
        sourceIp: options.identity.sourceIp || request.info.remoteAddress,
        user: options.identity.user || 'offlineContext_user',
        userAgent: request.headers['user-agent'],
        userArn: options.identity.userArn || 'offlineContext_userArn',
      },
      requestId: 'offlineContext_requestId_' + Math.random().toString(10).slice(2),
      resourceId: options.resourceId || 'offlineContext_resourceId',
      resourcePath: request.route.path,
      stage: options.stage
    },
    input: {
      json: x => 'need to implement',
      params: x => typeof x === 'string' ?
        request.params[x] || request.query[x] || request.headers[x] :
        {
          path: request.params,
          querystring: request.query,
          header: request.headers,
        },
      path: x => 'need to implement' // https://www.npmjs.com/package/jsonpath
    },
    stageVariables: options.stageVariables,
    util: {
      escapeJavaScript,
      urlEncode: encodeURI,
      urlDecode: decodeURI,
      base64Encode,
      base64Decode,
    }
  };
};
