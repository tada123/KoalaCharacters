
const sequelize = require('sequelize')
const {GraphQLObjectType, GraphQLList, GraphQLSchema} = require('graphql');
const assert = require('assert');
const {Sequelize, DataTypes} = sequelize;

function SequelizeObjectType(tp){
	assert(tp != undefined)
	return new GraphQLObjectType({name: tp.name, fields: (tp)}); 
}

function initSeq(){
	const seq = new Sequelize('galaxy', 'arthur', 'xvQqwww2Kczb7cuJ2dvfPy15abC', {
		host: 'dontpanic.k42.app',
		dialect: 'postgres',
		define: {
			freezeTableName: true,
		},
	});
	const Character = seq.define('Character', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING, 
		gender: DataTypes.STRING, 
		ability: DataTypes.STRING, 
		born: DataTypes.STRING, 
		in_space_since: DataTypes.STRING, 
		beer_consumption: DataTypes.INTEGER, 
		knows_the_answer: DataTypes.BOOLEAN, 
		weight: DataTypes.DOUBLE,
	}, {
		tableName: 'character',
		freezeTableName: true,
		timestamps: false,
		
	});
	const Nemesis = seq.define('Nemesis', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		character_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Character,
				key: 'id',
			}
		}, 
		is_alive: DataTypes.BOOLEAN, 
		years: DataTypes.INTEGER, 
	}, {
		tableName: 'nemesis',
		freezeTableName: true,
		timestamps: false,
		
	});
	
	const Secret = seq.define('Secret', {
		id: {type: DataTypes.INTEGER, primaryKey: true}, 
		secret_code: DataTypes.BIGINT,
		nemesis_id: DataTypes.INTEGER, 
	}, { 
		tableName: 'secret',
		freezeTableName: true,
		timestamps: false
	});
	Character.hasMany(Nemesis, { foreignKey: 'id' });
	Nemesis.belongsTo(Character, { foreignKey: 'character_id' });
	Secret.belongsTo(Nemesis, { foreignKey: 'nemesis_id' });

	
	console.log("chaseqname: ", Character.name)
	return {Character, Nemesis, Secret, seq};
}

async function testQuery(){
	const found = await Character.findAll()
	console.log("found:",found)
}

const seqs = initSeq()
function finalizeSeq(){
	console.log("FinalizeSeq: Closing sequelize connection NOW!")
	seqs.seq.close();
}

const CharacterType = SequelizeObjectType(seqs.Character);
const NemesisType = SequelizeObjectType(seqs.Nemesis);
const SecretType = SequelizeObjectType(seqs.Secret);
assert(seqs.Secret != undefined)
module.exports = {...seqs, testQuery, finalizeSeq, graphqlSchema: {CharacterType, NemesisType, SecretType}};


