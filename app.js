var settings = require('./settings.json');
var mqtt  = require('mqtt').connect(settings.mqtt);
const db = new (require('influxdb-nodejs'))(settings.influxdb);

mqtt.on('connect', function () {
  mqtt.subscribe('#')
});

mqtt.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  message = JSON.parse(message);

  db.write('temperature')
    .tag('deveui', message.deveui)
    .field(message.fields)
    .time(Date.now(), 'ms')
    .then(() => console.info('write point success'))
    .catch(console.error);

});
