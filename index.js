const {ApolloServer, gql} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const {users, events, participants, locations} = require("./data.js")
const {v4: uuidv4} = require("uuid");

const typeDefs = gql`
    #User
    type User {
        id: ID!
        username: String!
        email: String!
        events: [Event!]
        participants: [Participant!]
    }
    input CreateUserInput {
        username: String!
        email: String!
    }
    input UpdateUserInput {
        username: String
        email: String
    }

    #Participant
    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
        user: User!
        event: Event!
    }
    input CreateParticipantInput {
        user_id: ID!
        event_id: ID!
    }
    input UpdateParticipantInput {
        user_id: ID
        event_id: ID
    }

    #Event
    type Event {
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        user_id: ID!
        location: Location!
        user: User!
    }
    input CreateEventInput {
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        user_id: ID!
    }
    input UpdateEventInput {
        title: String!
        desc: String
        date: String
        from: String
        to: String
        location_id: ID
        user_id: ID
    }

    #Loaction
    type Location {
        id: ID!
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }
    input CreateLocationInput {
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }
    input UpdateLocationInput {
        name: String
        desc: String
        lat: Float
        lng: Float
    }


    type DeleteAllOutput {
        count: Int!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User!

        participants: [Participant!]!
        participant(id: ID!): Participant!

        events: [Event!]!
        event(id: ID!): Event!

        locations: [Location!]!
        location(id: ID!): Location!
    }

    type Mutation {
        #User
        createUser(data: CreateUserInput!): User!
        updateUser(id: ID!, data: UpdateUserInput): User!
        deleteUser(id: ID!): User!
        deleteAllUser: DeleteAllOutput!

        #Participant
        createParticipant(data: CreateParticipantInput): Participant!
        updateParticipant(id: ID!, data: UpdateParticipantInput): Participant!
        deleteParticipant(id: ID!): Participant!
        deleteAllParticipant: DeleteAllOutput!

        #Event
        createEvent(data: CreateEventInput): Event!
        updateEvent(id: ID! data: UpdateEventInput): Event!
        deleteEvent(id: ID!): Event!
        deleteAllEvent: DeleteAllOutput!

        #Location
        createLocation(data: CreateLocationInput): Location!
        updateLocation(id: ID! data: UpdateLocationInput): Location!
        deleteLocation(id: ID!): Location!
        deleteAllLocation: DeleteAllOutput!
    }

`

const resolvers = {
    Query: {

        // User
        users: () => users,
        user: (parent, {id}) => {
            const findUser = users.find(user => user.id === Number(id))
            if (!findUser) {
                throw new Error("User Not Found")
            }
            return findUser
        },

        //Participant
        participants: () => participants,
        participant: (parent, {id}) => {
            const findParticipant = participants.find(participant => participant.id === Number(id))

            if (!findParticipant) {
                throw new Error("Participant Not Found")
            }

            return findParticipant

        },

        //Event
        events: () => events,
        event: (parent, {id}) => {
            const findEvent = events.find(event => event.id === Number(id))

            if (!findEvent) {
                throw new Error("Event Not Found.")
            }

            return findEvent

        },

        //Location
        locations: () => locations,
        location: (parent, {id}) => {
            const findLocation = locations.find(location => location.id === Number(id))

            if (!findLocation) {
                throw new Error("Location Not Found")
            }

            return findLocation

        }
    },
    User: {
        events: ({id}) => {
            const datas = events.filter(event => event.user_id === id)

            if (!datas) {
                throw new Error("User Event Not Found")
            }
            return datas
        },
        participants: ({id}) => {
            const datas = participants.filter(participant => participant.user_id === id)

            if (!datas) {
                throw new Error("User Participant Not Found.")
            }

            return datas
        }
    },
    Participant: {
        user: ({user_id}) => {
            const findUser = users.find(user => user.id === user_id)

            if (!findUser) {
                throw new Error("Participant User Not Found.")
            }

            return findUser
        },
        event: ({event_id}) => {
            const findEvent = events.find(event => event.id === event_id)

            if (!findEvent) {
                throw new Error("Participant Event Not Found.")
            }

            return findEvent

        }
    },
    Event: {
        user: ({user_id}) => {
            const findUser = users.find(user => user.id === user_id)

            if (!findUser) {
                throw new Error("Event User Not Found.")
            }

            return findUser

        },
        location: ({location_id}) => {
            const findLocation = locations.find(location => location.id === location_id)

            if (!findLocation) {
                throw new Error("Event Location Not Found.")
            }

            return findLocation

        }
    },

    Mutation: {
        // User
        createUser: (parent, {data}) => {
            const user = {id: uuidv4(), ...data}
            users.push(user)
            return user
        },
        updateUser: (parent, {id, data}) => {
            const user_index = users.findIndex(user => user.id === Number(id))

            if (user_index === -1) {
                throw new Error("User Not Found.")
            }

            const updatedUser = users[user_index] = {
                ...users[user_index],
                ...data
            }

            return updatedUser

        },
        deleteUser: (parent, {id}) => {

            const user_index = users.findIndex(user => user.id === Number(id))

            if (user_index === -1) {
                throw new Error("User Not Found")
            }

            const deletedUser = users[user_index];
            users.splice(user_index, 1)
            return deletedUser
        },
        deleteAllUser: () => {
            const usersLength = users.length
            users.splice(0, usersLength)

            return {
                count: usersLength
            }

        },

        // Participant
        createParticipant: (parent, {data}) => {
            const participant = {id: uuidv4(), ...data}
            participants.push(participant)
            return participant
        },
        updateParticipant: (parent, {id, data}) => {
            const find_index = participants.findIndex(participant => participant.id === Number(id))

            if (find_index === -1) {
                throw new Error("Participant Not Found")
            }

            participants[find_index] = {
                ...participants[find_index],
                ...data
            }

            return participants[find_index]

        },
        deleteParticipant: (parent, {id}) => {
            const find_index = participants.findIndex(participant => participant.id === Number(id))

            if (find_index === -1) {
                throw new Error("Participant Not Found")
            }
            const deletedParticipant = participants[find_index]

            participants.splice(find_index, 1)

            return deletedParticipant

        },
        deleteAllParticipant: () => {
            const participantLength = participants.length
            participants.splice(0, participantLength)

            return {
                count: participantLength
            }

        },


        // Event
        createEvent: (parent, {data}) => {
            const event = {id: uuidv4(), ...data}
            events.push(event)
            return event
        },
        updateEvent: (parent, {id, data}) => {
            const find_index = events.findIndex(event => event.id === Number(id))

            if (find_index === -1) {
                throw new Error("Event Not Found")
            }

            const event = events[find_index] = {
                ...events[find_index],
                ...data
            }

            return event

        },
        deleteEvent: (parent, {id}) => {
            const find_index = events.findIndex(event => event.id === Number(id))

            if (find_index) {
                throw new Error("Event Not Found")
            }

            const deletedEvent = events[find_index]

            events.splice(find_index, 1)

            return deletedEvent

        },
        deleteAllEvent: () => {
            const eventsLength = events.length

            events.splice(0, eventsLength)

            return {
                count: eventsLength
            }

        },


        // Location
        createLocation: (parent, {data}) => {
            const location = {id: uuidv4(), ...data}
            locations.push(location)
            return location
        },
        updateLocation:(parent, {id, data}) => {
            const find_index = locations.findIndex(location => location.id === Number(id))

            if (find_index === -1) {
                throw new Error("Location Not Found")
            }

            const location = locations[find_index] = {
                ...locations[find_index],
                ...data
            }

            return location

        },
        deleteLocation: (parent, {id}) => {
            const find_index = locations.findIndex(location => location.id === Number(id))

            if (find_index === -1) {
                throw new Error("Location Not Found")
            }

            const deletedLocation = locations[find_index]

            locations.splice(find_index, 1)

            return deletedLocation

        },
        deleteAllLocation: () => {
            const locationLength = locations.length
            locations.splice(0, locationLength)
            return {
                count: locationLength
            }
        }
    }
}


const server = new ApolloServer({typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]})
server.listen().then(({url}) => console.log(`Apollo Server is up ${url}`))