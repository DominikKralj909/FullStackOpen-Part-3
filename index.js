const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

app.use(express.json())
app.use(morgan(':method :url :body'))

// Setting a port number
const PORT = 3001

// Defining the data
let persons = [
	{ 
	  "id": 1,
	  "name": "Arto Hellas", 
	  "number": "040-123456"
	},
	{ 
	  "id": 2,
	  "name": "Ada Lovelace", 
	  "number": "39-44-5323523"
	},
	{ 
	  "id": 3,
	  "name": "Dan Abramov", 
	  "number": "12-43-234345"
	},
	{ 
	  "id": 4,
	  "name": "Mary Poppendieck", 
	  "number": "39-23-6423122"
	}
];

// Handle HTTP GET requests made to the apps root
app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>')
});

// Handle HTTP GET requests made to the persons part of the app
app.get('/api/persons', (request, response) => {
	response.json(persons);
});

// Handle HTTP GET request made to the info part of the app
app.get('/info', (request, response) => {
	const currentDate = new Date();

	response.send(`
		<div> 
			<h3>Phonebook has info for ${persons.length} people</h3>
			<p>${currentDate}</p>
		</div>
	`);
});

// Handle HTTP GET request for each person
app.get('/api/persons/:id', (request, response) => {
	const id = parseInt(request.params.id);
	const person = persons.filter(person => person.id === id);

	if (person.length === 0) response.status(400).send('Person not found');
	
	return response.send(person);
});

// Handle HTTP Delete request for each person
app.delete('/api/persons/:id', (request, response) => {
	const id = parseInt(request.params.id);
	const person = persons.filter(person => person.id !== id);

	if (person.length === 0) response.status(400).send('Person not found');
	
	return response.send(person);
});

app.post('/api/persons', (request, response) => {
	const body = request.body;
	const names = persons.map(({ name }) => name);

	const person = {
		id: Math.floor(Math.random() * 100),
		name: 'Test Name',
		number: '3223-323234-34242'
	}

	if (!body.name) console.error('Name is missing');
	if (!body.number) console.error('Number is missing');
	if (names.includes(body.name)) console.error('Name already exists');

	persons = persons.concat(person)
	response.json(person)
});

app.use(morgan('dev', {
	skip: function (req, res) { return res.statusCode < 400 }
}));

morgan.token('body', req => {
	return JSON.stringify(req.body)
})
  
app.use(morgan(':method :url :body'))
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

