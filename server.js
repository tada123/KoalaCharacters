const { ApolloServer, gql } = require("apollo-server-express");
const seq = require('./seq');
const {Character, Nemesis, Secret} = seq;
const express = require('express');
const util = require('node:util');
const typeDefs = gql`
  type Secret {
    id: Int
    nemesis_id: Int
    secret_code: String #BigInt, but GraphQL needs an extension for this, so i use string here for the testing purpose
  }

  type Nemesis {
    id: Int
    character_id: Int
    is_alive: Boolean
    years: Int
    secret: Secret
	character: Character
  }

  type Character {
    id: Int
    name: String
    gender: String
    ability: String
    weight: Float
    born: String
    in_space_since: String
    beer_consumption: Int
    knows_the_answer: Boolean
    nemeses: [Nemesis]
  }

  type Query {
    characters: [Character]
    nemeses: [Nemesis]
    secrets: [Secret]
  }
	
`;
const resolvers = {
  Query: {
    characters: async () => {
      return await Character.findAll({ include: [Nemesis] });
    },
    nemeses: async () => {
      return await Nemesis.findAll({ include: [Secret] });
    },
    secrets: async () => {
      return await Secret.findAll();
    },
  },
  Character: {
    nemeses: async (parent) => {
      return await Nemesis.findAll({ where: { character_id: parent.id } });
    },
  },
  Nemesis: {
    secret: async (parent) => {
      return await Secret.findOne({ where: { nemesis_id: parent.id } });
    },
    character: async (parent) => {
      return await Character.findOne({ where: { id: parent.character_id } });
	}, 
  },
};

const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: (err) => {
		//The Apollo server sends whole error with stacktrace to the client (Not very safe), but for this testing purpose, i left it enabled
		return err;
	},
});
server.start().then(() => {
	server.applyMiddleware({app})
});
app.listen(8888);


