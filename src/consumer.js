const client = require('node-eventstore-client')
const processor = require('./processor/WebLinkProcessor')
const config = require('./config')

const validData = function (data) {
    return data.hasOwnProperty("reference") &&
        data.reference.hasOwnProperty("reference") &&
        data.reference.reference.startsWith("http")
}

const eventAppeared = (stream, payload) => {
    const event = JSON.parse(payload.originalEvent.data.toString())
    validData(event.data) ? processor.process(event.data.reference) : null
}

const liveProcessingStarted = () => {
    console.log("Caught up with previously stored events. Listening for new events.")
}

const subscriptionDropped = (subscription, reason, error) =>
    console.log(error ? error : "Subscription dropped.")

const credentials = new client.UserCredentials("admin", "changeit")

const settings = {
    verboseLogging: true
}
const endpoint = config.eventstore.endpoint
const connection = client.createConnection(settings, endpoint)

connection.connect().catch(err => console.log(err))

connection.once("connected", tcpEndPoint => {
    const subscription = connection.subscribeToStreamFrom(
        "reference",
        null,
        true,
        eventAppeared,
        liveProcessingStarted,
        subscriptionDropped,
        credentials
    )
    console.log(`Connected to eventstore at ${tcpEndPoint.host}:${tcpEndPoint.port}`)
    console.log(`subscription.isSubscribedToAll: ${subscription.isSubscribedToAll}`)
})

connection.on("error", err =>
    console.log(`Error occurred on connection: ${err}`)
)

connection.on("closed", reason =>
    console.log(`Connection closed, reason: ${reason}`)
)