var mqtt  = require('mqtt').connect('mqtt://192.168.1.174');
const db = new (require('influxdb-nodejs'))('http://192.168.1.174:8086/teletask');

mqtt.on('connect', function () {
  mqtt.subscribe('#')
});

mqtt.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());

  var measurement = topic.split('/')[0];
  var number = topic.split('/')[1];
  var values = {};
  switch (measurement) {
      case 'relay':
          values.state = message == 'on' ? 'TRUE' : 'FALSE';
          break;
      case 'sensor':
          values.temperature = Math.round( parseFloat(message) * 10) / 10;
          break;
      default:

  }

  console.log("---");
  console.log("Measurement: " + measurement);
  console.log("Number:      " + number);
  console.log("Values:      " + JSON.stringify(values));

  db.write(measurement)
    .tag('number', number)
    .field(values)
    .time(Date.now(), 'ms')
    .then(() => console.info('write point success'))
    .catch(console.error);

});
