export const Persons = ({ filteredPersons, onPersonDelete }) => {
    return filteredPersons.length === 0 ? 'No persons found' : filteredPersons.map(({ name, number, id }) => (
        <div key={number}>
            <div key={name}>{name} - {number}</div>
            <button key={id} onClick={() => onPersonDelete(id, name)}>Delete</button>
        </div>
    ));
};