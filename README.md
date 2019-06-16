## Synopsis

[![Greenkeeper badge](https://badges.greenkeeper.io/kobik/kafka-http-proxy.svg)](https://greenkeeper.io/)

A simple and straight forward Kafka HTTP proxy

## Motivation

A simple and straight forward Kafka HTTP proxy

## Installation

    docker run -p $PORT:$PORT \
        -e $PORT \
        -e ZOOKEEPER_ADDRESSES=<$ZK_ADDR:$ZK_PORT>
        dockername

## API Reference

### Create topic

    POST /topics/{topic}
Example:
To create a topic named 'frodo'

    POST /topics/frodo

### Create consumer on a topic

    POST /topics/{topic}/consumer

- Optional params

    - simple: true - return the bare message value from kafka,

Body

See kafka-node documentation on consumerGroup options - https://www.npmjs.com/package/kafka-node#consumergroup

#### Example

To create a new consumer for a topic named 'frodo'

    POST /topics/frodo/consumer

#### Example

To create a new consumer for a topic named 'frodo' and under a consumerGroup named 'thefellowship'

    POST /topics/frodo/consumer
    {
        consumerGroup: 'thefellowship'
    }

### Delete a consumer

    DELETE /topics/{topic}/consumer

#### Example

    DELETE /topics/frodo/consumer

### Consumer messages from a topic

    GET /topics/{topic}/messages

#### Example

    GET /topics/{topic}/messages

## Tests

TODO

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)