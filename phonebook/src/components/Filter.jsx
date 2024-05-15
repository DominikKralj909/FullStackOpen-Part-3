export const Filter = ({ searchedName, onNameSearch }) => {
    return (
        <div>
			filter shown with: <input type="search" value={searchedName} onChange={onNameSearch} />
		</div>
    );
}