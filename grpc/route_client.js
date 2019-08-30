var PROTO_PATH = __dirname + '/../protos/route_service.proto';

var async = require('async');
var fs = require('fs');
var parseArgs = require('minimist');
var path = require('path');
var _ = require('lodash');
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
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
var routeService = protoDescriptor.grpc.route;

var client = new routeService.RouteService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

function invokeBizCallback(error, response) {
    if (error) {
        console.log(error);
        return;
    }
    console.log('reponse : ' + JSON.stringify(response));
    return;
}

var request = {
    meta: {
        "request_id": "292c9042-29a3-4210-8b53-19ac393de40d",
        "language": "en_US",
        "timezone": "Hello",
        "token": "token"
    },
    api_name: "account",
    data: "Hello"
}

client.invokeBiz(request, invokeBizCallback);
