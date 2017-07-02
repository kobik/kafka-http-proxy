var Promise = require('bluebird');
var kafka = require('kafka-node');
var _ = require('lodash');
var uuid = require('uuid');
var host = process.env.ZOOKEEPER_ADDRESSES;

function Producer(options) {
    this.id = uuid.v4();
    this.options = options;
    this.client = new kafka.Client(host);
}

Producer.prototype.init = function () {
    console.log('Init Kafka producer');
    var thisVar = this;
    var promise = new Promise(function (resolve, reject) {
        thisVar.producer = new kafka.HighLevelProducer(thisVar.client, thisVar.options);
        thisVar.producer.on('ready', function () {
            console.log('Kafka producer ready');
            return resolve();
        });
        thisVar.producer.on('error', function (error) {
            var message = 'Failed to create Kafka producer';
            console.info(message, error);
            return reject(new Error(message));
        });
    });
    return promise;
};

Producer.prototype.send = function (topic, messages) {
    var thisVar = this;
    var promise = new Promise((resolve, reject) => {
        var m = messages.map((message) => JSON.stringify(message));
        console.info('Sending message', {topic: topic, messages: m});
        thisVar.producer.send([
            { topic: topic, messages: m }
        ], function (error, data) {
            if (error) {
                var message = 'Failed to send messages to Kafka server';
                console.info(message, error);
                return reject(new Error(message));
            }
            return resolve(data);
        });
    });
    return promise;
};

Producer.prototype.createTopics = function(topics) {
    var thisVar = this;
    var promise = new Promise(function (resolve, reject) {
        console.log('Creating kafka topic(s)', topics);
        thisVar.producer.createTopics(topics, true, function (error, res) {
            if (error) {
                var message = 'Failed to create topic(s)';
                console.error(message, error);
                return reject(new Error(message));
            }
            console.log('Kafka topic(s) created');
            return resolve(res);
        });
    });
    return promise;
};

module.exports = Producer;