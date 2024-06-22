import { useState, useEffect } from 'react';
import personService from './services/persons';
import { Filter } from './components/Filter';
import { PersonForm } from './components/PersonForm';
import { Persons } from './components/Persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [searchedName, setSearchedName] = useState('');
    const [addedPerson, setAddedPerson] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        personService.getAllPersons().then(({ data }) => setPersons(data));
    }, []);

    const handleNameChange = (event) => setNewName(event.target.value);
    const handleNumberChange = (event) => setNewNumber(event.target.value);
    const handleNameSearch = (event) => setSearchedName(event.target.value);

    const handlePersonSubmit = (event) => {
        event.preventDefault();

        if (newName.trim() === '' || newNumber.trim() === '') {
            alert(`Please enter both name and number`);
            return;
        }

        const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

        if (existingPerson) {
            const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

            if (confirmUpdate) {
                const updatedPerson = { ...existingPerson, number: newNumber };

                personService.updatePerson(existingPerson.id, updatedPerson)
                    .then(({ data }) => {
                        setPersons(persons.map(person =>
                            person.id === existingPerson.id ? data : person
                        ));
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch(error => {
                        console.error('Error updating person:', error);
                        setErrorMsg(`Information of ${newName} has already been removed from the server`);
                    });
            }
        } else {
            personService.createPerson({ name: newName, number: newNumber })
                .then(({ data }) => {
                    setPersons(persons.concat(data));
                    setNewName('');
                    setNewNumber('');
                })
                .catch(error => console.error('Error adding person:', error));
            setAddedPerson(newName);
        }
    };

    const handlePersonDelete = (id, name) => {
        const confirmDelete = window.confirm(`Delete ${name}?`);

        if (confirmDelete) {
            personService.deletePerson(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                })
                .catch(error => {
                    console.error('Error deleting person:', error);
                    setErrorMsg(`Error deleting ${name}`);
                });
        }
    };

    const filteredPersons = persons.filter(({ name }) => name.toLowerCase().includes(searchedName.toLowerCase()));

    return (
        <div>
            <h2>Phonebook</h2>
            {addedPerson && <div className="added-person">{`Added ${addedPerson}`}</div>}
            {errorMsg && <div className="error">{errorMsg}</div>}
            <Filter searchedName={searchedName} onNameSearch={handleNameSearch} />
            <h3>Add a new person</h3>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                onPersonSubmit={handlePersonSubmit}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons filteredPersons={filteredPersons} onPersonDelete={handlePersonDelete} />
        </div>
    );
};

export default App;
