const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

// Command-line arguments
const [password, name, number] = process.argv.slice(2);

// Encode the password if it contains special characters
const encodedPassword = encodeURIComponent(password);

// Construct the URI with the provided password
const uri = `mongodb+srv://kraljdominik97:${encodedPassword}@fullstackopen.mjnjgzz.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpen`;

// MongoClient setup to send a ping
async function runMongoClient() {
	const client = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		}
	});

	try {
		// Connect the client to the server (optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} catch (error) {
		console.error("Error with MongoClient:", error);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}

// Mongoose setup to define schema and save data
const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

async function runMongoose() {
	try {
		// Connect to MongoDB using Mongoose
		await mongoose.connect(uri, {
			dbName: 'fullstackopen' // Replace with your actual database name
		});
		console.log("Mongoose connected successfully!");
		// Create and save a new person document
		const person = new Person({ name, number });

		const result = await person.save();
		console.log('Person saved:', result);
	} catch (error) {
		console.error("Error with Mongoose:", error);
	} finally {
		// Close the Mongoose connection
		await mongoose.connection.close();
	}
}

// Function to list all persons
async function listPersons() {
	try {
		await mongoose.connect(uri, {
		dbName: 'fullstackopen' // Replace with your actual database name
	});

	console.log("Mongoose connected successfully!");
	const persons = await Person.find({});
	console.log("Persons in the database:");

	persons.forEach(person => {
		console.log(`${person.name} ${person.number}`);
	});

	} catch (error) {
		console.error("Error with Mongoose:", error);
	} finally {
		await mongoose.connection.close();
	}
}

// Determine action based on command-line arguments
if (name && number) {
  runMongoose().catch(console.dir);
} else {
  listPersons().catch(console.dir);
}

// Optionally, you can still run the MongoClient ping
runMongoClient().catch(console.dir);
