const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
const moment = require('moment');

const connectionString =
  "mongodb+srv://tsmilgius:E58-Qegqddf$KdW@peritoneal-39kmv.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(connectionString, { useNewUrlParser: true });

const Question = mongoose.model("Questions", {
  category: String,
  question: String,
  correctAnswer: String,
  language: String,
  incorrectAnswers: Array,
  addedDate: String
});

const typeDefs = `
  type Query {
    questions: [Question]
  }

  type Question {
    id: ID!
    category: String
    question: String
    correctAnswer: String
    language: String
    incorrectAnswers: [String]
    addedDate: String 
  }

  type Mutation {
    createQuestion(
      category: String
      question: String
      correctAnswer: String
      language: String
      incorrectAnswers: [String]
      addedDate: String): Question
    removeQuestion(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    questions: () => Question.find()
  },
  Mutation: {
    createQuestion: async (
      _,
      { category, question, correctAnswer, language, incorrectAnswers }
    ) => {
      const askedQuestion = new Question({
        category,
        question,
        correctAnswer,
        language,
        incorrectAnswers,
        addedDate: moment()
          .utc()
          .format()
      });
      await askedQuestion.save();
      return askedQuestion;
    },
    removeQuestion: async (_, { id }) => {
      await Question.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log("Server is running on localhost:4000"));    
});
