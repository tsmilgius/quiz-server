const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
const moment = require('moment');

const connectionString =
  "mongodb+srv://tsmilgius:E58-Qegqddf$KdW@peritoneal-39kmv.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, });

const Therapy = mongoose.model('Therapy', {
  cycles: Number,
  fillVolume: Number,
  dwellTime: Number,
  lastFillVolume: Number,
  totalTime: Number,
  startDate: String,
  ultrafiltration: Number,
  bags: Array
});

const typeDefs = `
  type Query {
    therapies: [Therapy]
  }

  type Therapy {
      id: ID!
      cycles: Int
      fillVolume: Int
      dwellTime: Int
      lastFillVolume: Int
      totalTime: Int
      startDate: String
      ultrafiltration: Int
      bags: [Float]
      
  }

  type Mutation {
    createTherapy(
      cycles: Int!
      fillVolume: Int!
      dwellTime: Int!
      lastFillVolume: Int!
      totalTime: Int
      ultrafiltration: Int
      bags: [Float] ): Therapy
    removeTherapy(id: ID!): Boolean
  }
    
`;

const resolvers = {
  Query: {
    therapies: () => Therapy.find()
  },
  Mutation: {
    createTherapy: async (
      _,
      {
        cycles,
        fillVolume,
        dwellTime,
        lastFillVolume,
        totalTime,
        ultrafiltration,
        bags
      }
    ) => {
      const therapy = new Therapy({
        cycles,
        fillVolume,
        dwellTime,
        lastFillVolume,
        totalTime,
        startDate: moment()
          .utc()
          .format(),
        ultrafiltration,
        bags
      });
      await therapy.save();
      return therapy;
    },
    removeTherapy: async (_, { id }) => {
      await Therapy.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log("Server is running on localhost:4000"));    
});
