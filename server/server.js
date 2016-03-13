var amqp = require('amqplib/callback_api');
var _ = require('lodash');

function create_conn(cb) {
  amqp.connect('amqp://localhost', function(err, conn) {
    cb(conn);
  });
}

/*{
        desi: '10',
        dir: '1',
        oper: 'XXX',
        veh: 'RHKL00093',
        tst: '2016-03-12T14:59:44.000Z',
        tsi: 1457794784,
        spd: 4.37,
        hdg: 77,
        lat: 60.166382,
        long: 24.930009,
        dl: 20,
        odo: 821,
        oday: '2016-03-12',
        jrn: 'XXX',
        line: 'XXX',
        start: '1656',
        stop_index: 5,
        source: 'hsl live'
}*/

var trams = {};

function get_positions(conn, cb) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue('', { exclusive: true, autodelete: true }, function(err, q) {
                var corr = generateUuid();

                ch.consume(q.queue, function(msg) {
                    if (msg.properties.correlationId == corr) {

                        //console.log('reload at ' + Date.now());

                        msg = JSON.parse(msg.content);

                        trams = _(msg).map(function(t) {
                          return {
                            lat: t.VP.lat,
                            lng: t.VP.long,
                            message: t.VP.desi,
                            dl: t.VP.dl,
                            veh: t.VP.veh,
                            VP: t.VP
                          };
                        }).keyBy('veh').value();

                        //ch.close();

                        cb(trams);
                    }
                }, {noAck: true});

                ch.sendToQueue('hsl_positions',
                    new Buffer(''),
                    { correlationId: corr, replyTo: q.queue });
            });
        });
}

function generateUuid() {
    return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

const http = require('http');

const hostname = '127.0.0.1';
const port = 5005;

create_conn(function(conn) {
  http.createServer((req, res) => {
    get_positions(conn, function (data) {
      console.log("positions updated");
    });

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(trams));
  }).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
