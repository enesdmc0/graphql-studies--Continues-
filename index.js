const {ApolloServer, gql} = require("apollo-server");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core")
const {users, events, locations, participants} = require("./data")


const typeDefs = gql`
type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
}

type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]!
}

type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
}

type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
}

type Query {
    users: [User!]!
    user(id: ID!): User!

    events: [Event!]!
    event(id: ID!): Event!

    participants: [Participant!]!
    participant(id: ID!): Participant!

    locations: [Location!]!
    location(id: ID!): Location!
}

`

const resolvers = {
    Query: {
        users: () => users,
        user: (parent, args) => {
            const user = users.find(user => user.id === Number(args.id))
            if(!user) {
                throw new Error("User not found!!")
            }
            return user
        },

        events: () => events,
        event: (parent, args) => {
            const event = events.find(event => event.id === Number(args.id))
            if (!event) {
                throw new Error("Event not found!!")
            }
            return event
        },
        participants: () => participants,
        participant: (parent, args) => {
            const participant = participants.find(participant => participant.id === Number(args.id))
            if (!participant) {
                throw new Error("Participant not found!!")
            }
            return participant
        },

        locations: () => locations,
        location: (parent, args) => {
            const location = locations.find(location => location.id === Number(args.id))
            if(!location) {
                throw new Error("Location not found!!")
            }
            return location
        }
    },
    User: {
        events: (parent, args) => {
            const datas = events.filter(event => event.user_id === parent.id)
            if(!datas) {
                throw new Error("User event not fount!!")
            }
            return datas
        }
    },
    Event: {
        user: (parent, args) => {
            const data = users.find(user => user.id === parent.user_id)
            if(!data) {
                throw new Error("User not found!")
            }
            return data
        },
        location: (parent, args) => {
            const data = locations.find(location => location.id === parent.location_id) 
            if(!data) {
                throw new Error("location not found")
            }
            return data
        },
        participants: (parent, args) => {
            const datas = participants.filter(participant => participant.event_id === parent.id);
            if(!participants) {
                throw new Error("Participants not found!!")
            }
            return datas
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})]})

server.listen().then(({url}) => console.log(`Apollo server is up ${url} `))