var PROTO_PATH = __dirname + '/../protos/route_service.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

uuidv4 = require('uuid/v4');

// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var routeService = protoDescriptor.grpc.route;

/**
 * invokeBiz handler. Invoke core business, and responds.
 * @param {Duplex} call The stream for incoming and outgoing messages
 * @param {function(Error, feature)} callback Response callback
 */
function invokeBiz(call, callback) {

    var request = call.request;
    console.log('receive : ' + JSON.stringify(request));

    var data = uuidv4();
    var response = {};
    response.meta = request.meta;
    response.data = data;

    console.log('reply : ' + JSON.stringify(response));
    callback(null, response);
}

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
    var server = new grpc.Server();
    server.addProtoService(routeService.RouteService.service, {
        invokeBiz: invokeBiz,
    });
    return server;
}

var route_server = getServer();
route_server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
route_server.start();