import personService from '../services/persons'

export const Persons = ({ filteredPersons }) => {
    const handlePersonDelete = (id, name) => {
        window.confirm(`Delete ${name} ?`)

        personService.deletePerson(id).then(response => {
            console.log('Delete request response:', response);
        }).catch(error => {
            console.error('Error deleting persion:', error)
        })
    }

    return filteredPersons.length === 0 ? 'No persons found' : filteredPersons.map(({ name, number, id }) => (
        <div key={number}>
            <div key={name}>{name} - {number}</div>
            <button key={id} onClick={() => handlePersonDelete(id, name)}>Delete</button>
        </div>
    ))
}