var Promise = require('bluebird');
var kafka = require('kafka-node');
var _ = require('lodash');
var ZOOKEEPER_ADDRESSES = process.env.ZOOKEEPER_ADDRESSES || 'localhost:2181';
var UNIQUE_GID = 'kafka-proxy-6115032b-8e15-4a58-ac7b-a591fb666be6';

function Consumer(options) {
    this.active = true;
    this.messages = [];
    this.simple = options.simple || true;
    this.maxMessages = options.max_messages || 1000;
    this.options = _.defaultsDeep({
        // sessionTimeout: 5000,
        groupId: UNIQUE_GID
    }, options);
    this.client = new kafka.Client(ZOOKEEPER_ADDRESSES);
}

Consumer.prototype.init = function(topic) {
    var promise = new Promise((resolve, reject) => {
        this.topic = topic;
        this.consumer = new kafka.ConsumerGroup(this.options, topic);
        var myThis = this;
        this.consumer.on('connect', function () {
            resolve();
        });
        this.consumer.on('message', function (message) {
            message = myThis ? message.value : message;
            myThis.messages.push(message);
            console.info('Message received', {topic: myThis.topic, message: message});
            if (myThis.active && myThis.messages.length >= myThis.maxMessages) {
                console.info('Max messages threshold reached');
                myThis.pause();
            }
        });
        this.consumer.on('error', function (err) {
            console.log('Kafka error', err);
        });
        this.consumer.on('offsetOutOfRange', function (err) {
            console.log('offsetOutOfRange Error', err);
        });
    });
    return promise.timeout(30000, new Error('Timeout connenting to Kafka'));
};

Consumer.prototype.closeConnection = function() {
    var thisVar = this;
    var promise = new Promise((resolve, reject) => {
        thisVar.consumer.close(true, () => {
            return resolve();
        });
    });
    return promise;
};

Consumer.prototype.consume = function () {
    var messagesToReturn = _.cloneDeep(this.messages);
    this.messages = [];
    if (!this.active) {
        this.resume();
    }
    console.info('Consumed messages', {topic: this.topic, count: messagesToReturn.length});
    return messagesToReturn;
};

Consumer.prototype.pause = function() {
    console.info('Pausing Kafka consumption on topic', this.topic);
    this.active = false;
    this.consumer.pause();
};

Consumer.prototype.resume = function() {
    console.info('Resuming Kafka consumption on topic', this.topic);
    this.active = true;
    this.consumer.resume();
};

module.exports = Consumer;