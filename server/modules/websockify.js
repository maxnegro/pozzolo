
// var Net = Npm.require('net');
// var Buffer = Npm.require('buffer').Buffer;
// var WebSocketServer = Npm.require('ws').Server

var net = Npm.require('net'),
    http = Npm.require('http'),
    // https = require('https'),
    url = Npm.require('url'),
    path = Npm.require('path'),
    // policyfile = Npm.require('policyfile'),

    // Buffer = Npm.require('buffer').Buffer,
    // WebSocketServer = Npm.require('ws').Server,
    WebSocketServer = Meteor.npmRequire('ws'),

    webServer, wsServer,
    source_host, source_port, target_host, target_port,
    web_path = null;

var panelAddress = [];

// function targetFromUrl(url) {
//   // var future = new Future;
//   // future.resolve(function(err, val) {
//     var panelID = path.basename(url);
//     var Fiber = Npm.require(fibers);
//     var targetPanel = Pannelli.findOne({_id:panelID});
//     if (targetPanel) {
//       return { host: currentPanel.host, port: currentPanel.port };
//     } else {
//       log('unable to find target');
//       // client.close();
//       return {};
//     }
//   // });
//
// }

// Handle new WebSocket client
new_client = function(client) {
    var clientAddr = client._socket.remoteAddress, log;
    var targetAddress = panelAddress[path.basename(client.upgradeReq.url)];
    // console.log(path.basename(client.upgradeReq.url));
    log = function (msg) {
        console.log(' ' + clientAddr + ': '+ msg);
    };
    log('WebSocket connection');
    log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol);

    // console.log(client);

    var target = net.createConnection(targetAddress.port,targetAddress.host, function() {
        log('connected to target');
    });

    target.on('data', function(data) {
        //log("sending message: " + data);
        try {
            if (client.protocol === 'base64') {
                client.send(new Buffer(data).toString('base64'));
            } else {
                client.send(data,{binary: true});
            }
        } catch(e) {
            log("Client closed, cleaning up target");
            target.end();
        }
    });
    target.on('end', function() {
        log('target disconnected');
        client.close();
    });
    target.on('error', function() {
        log('target connection error');
        target.end();
        client.close();
    });

    client.on('message', function(msg) {
        //log('got message: ' + msg);
        if (client.protocol === 'base64') {
            target.write(new Buffer(msg, 'base64'));
        } else {
            target.write(msg,'binary');
        }
    });
    client.on('close', function(code, reason) {
        log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
        target.end();
    });
    client.on('error', function(a) {
        log('WebSocket client error: ' + a);
        target.end();
    });
};

// Select 'binary' or 'base64' subprotocol, preferring 'binary'
selectProtocol = function(protocols, callback) {
    if (protocols.indexOf('binary') >= 0) {
        callback(true, 'binary');
    } else if (protocols.indexOf('base64') >= 0) {
        callback(true, 'base64');
    } else {
        console.log("Client must support 'binary' or 'base64' protocol");
        callback(false);
    }
}

// console.log("WebSocket settings: ");
// console.log("    - proxying from " + source_host + ":" + source_port +
            // " to " + target_host + ":" + target_port);

// Send an HTTP error response
http_error = function (response, code, msg) {
    response.writeHead(code, {"Content-Type": "text/plain"});
    response.write(msg + "\n");
    response.end();
    return;
}
webServer = http.createServer(function (res,req) {
  return http_error(res, 403, "403 Permission Denied");
});

webServer.listen(3010, function() {
    wsServer = new WebSocketServer.Server({server: webServer,
                                    handleProtocols: selectProtocol});
    wsServer.on('connection', new_client);
});

Meteor.methods({
  setupWsProxy: function (panelID) {
    check(panelID, String);
    var currentPanel = Pannelli.findOne({_id:panelID});
    if (currentPanel) {
      // if (typeof panelAddress[panelID] === 'undefined') {
        panelAddress[panelID] = { host: currentPanel.host, port: currentPanel.port };
      // }
      // console.log(panelAddress);
    }
  }
});
// Attach Flash policyfile answer service
// policyfile.createServer().listen(-1, webServer);
