var Producer = require('./../model/producer');
var Consumer = require('./../model/consumer');
var express = require('express');
var router = express.Router();
var producer;
var consumer = {};

// Create topic
router.post('/:topic', function(req, res, next) {
    var topic = req.params.topic;
    createProducer()
        .then(() => producer.createTopics(topic))
        .then(() => res.status(201).json())
        .catch((error) => res.status(500).json({message: error}));
});

// Create a consumer
router.post('/:topic/consumers', function(req, res, next) {
    var topic = req.params.topic;
    createConsumer(topic, req.body)
        .then(() => res.status(201).json({message: 'Consumer created succussfully', topic: topic}))
        .catch((error) => res.status(500).json({message: error, topic: topic}));
});

// Delete a consumer
router.delete('/:topic/consumers', function(req, res, next) {
    var topic = req.params.topic;
    if (consumer[topic]) {
        consumer[topic].closeConnection();
        consumer[topic] = undefined;
        res.status(200).json({message: 'Consumer deleted succussfully', topic: topic});
    } else {
        res.status(400).json({message: 'Consumer does not exist', topic: topic});
    }
});

// Publish messages to a topic
router.post('/:topic/messages', function(req, res, next) {
    var topic = req.params.topic;
    var messages = req.body.messages;
    createProducer()
        .then(() => producer.send(topic, messages))
        .then(() => res.status(200).json({message: 'Messages sent successfully', topic: topic}))
        .catch((error) => res.status(500).json({message: error}));
});

// Consume from a topic (deletes the messages after they consumed)
router.get('/:topic/messages', function(req, res, next) {
    var topic = req.params.topic;
    if (!consumer[topic]) {
        res.status(400).json({message: 'Kafka consumer does not exist', topic: topic});
    } else {
        var messsages = consumer[topic].consume();
        res.status(200).json(messsages);
    }
});

var createProducer = function () {
    if (producer) {
        return Promise.resolve();
    } else {
        var prd = new Producer();
        return prd.init().then(() => { producer = prd });
    }
};

var createConsumer = function (topic, options) {
    if (consumer[topic]) {
        return Promise.reject('Consumer already exists');
    } else {
        consumer[topic] = new Consumer(options);
        return consumer[topic].init(topic);
    }
};

module.exports = {
    router: router,
    consumer: consumer,
    producer: producer
};