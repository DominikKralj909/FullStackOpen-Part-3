const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS setup
app.use(cors());

// Morgan setup
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :body'));

// Setting a port number
const PORT = 3001;

// Defining the data
let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    }, { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    }, { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    }, { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
];

// Handle HTTP GET requests made to the app's root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
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
    const person = persons.find(person => person.id === id);

    if (!person) {
        return response.status(404).send('Person not found');
    }

    response.json(person);
});

// Handle HTTP DELETE request for each person
app.delete('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const personIndex = persons.findIndex(person => person.id === id);

    if (personIndex === -1) {
        return response.status(404).send('Person not found');
    }

    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

// Handle HTTP POST request to add a new person
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ error: 'Name is missing' });
    }
    if (!body.number) {
        return response.status(400).json({ error: 'Number is missing' });
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: 'Name already exists' });
    }

    const person = {
        id: Math.floor(Math.random() * 100),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);
    response.json(person);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
