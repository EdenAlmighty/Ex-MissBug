const { useState, useEffect } = React

export function BugFilter({ onSetFilter, filterBy }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

	useEffect(() => {
		onSetFilter(filterByToEdit)
	}, [filterByToEdit])

	function onSubmitFilter(ev) {
		ev.preventDefault()
		onSetFilter(filterByToEdit)
	}

	function handleChange({ target }) {
		const field = target.name
		
		const value = target.type === 'number' ? +target.value || '' : target.value
		setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
	}

	return (
		<section className="bug-filter full main-layout">
			<h2>Filter Our Bugs</h2>

			<form onSubmit={onSubmitFilter}>
				<label htmlFor="title">Title:</label>
				<input
					value={filterByToEdit.txt}
					onChange={handleChange}
					name="txt"
					id="title"
					type="text"
					placeholder="By Title"
				/>

				<label htmlFor="severity">Severity:</label>
				<input
					value={filterByToEdit.severity}
					onChange={handleChange}
					name="severity"
					id="severity"
					type="number"
					placeholder="By Severity"
				/>

				<label htmlFor="labels">Labels:</label>
				<input
					value={filterByToEdit.labels}
					onChange={handleChange}
					name="labels"
					id="labels"
					type="text"
					placeholder="By labels"
				/>

				<button>Filter Bugs</button>
			</form>
		</section>
	)
}