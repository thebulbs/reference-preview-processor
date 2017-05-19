const client = require('eventstore-node')
const knowledge = require('./adapter/knowledge')
const config = require('./config')

const eventAppeared = (subscription, event) => {
    knowledge.store(
        event.originalEvent.eventType,
        JSON.parse(event.originalEvent.data.toString())
    )
}

const subscriptionDropped = (subscription, reason, error) =>
    console.log(error ? error : "Subscription dropped.")

const credentials = new client.UserCredentials("admin", "changeit")

const settings = {
    verboseLogging: true
}
const endpoint = config.eventstore.endpoint
const connection = client.createConnection(settings, endpoint)

connection.on('heartbeatInfo', heartbeatInfo => {
    console.log('Connected to endpoint', heartbeatInfo.remoteEndPoint)
    console.log('Heartbeat latency', heartbeatInfo.responseReceivedAt - heartbeatInfo.requestSentAt)
})

connection.once("connected", tcpEndPoint => {
    console.log(`Connected to eventstore at ${tcpEndPoint.host}:${tcpEndPoint.port}`)
    connection.connectToPersistentSubscription(
        'reference',
        'bulb',
        eventAppeared,
        subscriptionDropped,
        credentials
    )
})

connection.on("error", error =>
    console.log(`Error occurred on connection: ${error}`)
)

connection.on("closed", reason => {
    console.log(`Connection closed, reason: ${reason}`)
})


connection.connect().catch((err) => {
    console.log(err)
})


