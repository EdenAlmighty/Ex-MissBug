import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugSort } from '../cmps/BugSort.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BugIndex() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams) || {})
    const [sortBy, setSortBy] = useState({ type: '', dir: 1 })

    useEffect(() => {
        setSearchParams(filterBy)
        loadBugs()
    }, [filterBy,sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then((bugs) => setBugs(bugs))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onSetFilter(fieldsToUpdate) {
        setFilterBy(prevFilter => {
            if (prevFilter.pageIdx !== undefined) prevFilter.pageIdx = 0
            return { ...prevFilter, ...fieldsToUpdate }
        })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) nextPageIdx = 0
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: filterBy.pageIdx === undefined ? 0 : undefined
        }))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSetSort(sortBy) {
		setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
	}

    return (
        <main>
            <h3>Bugs App</h3>
            <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
            <BugSort onSetSort={ onSetSort } sortBy={ sortBy } />
            <main>
                <section className='pagination'>
                    <button onClick={() => onChangePage(-1)}>-</button>
                    <span>{filterBy.pageIdx + 1 || 'NoPagination'}</span>
                    <button onClick={() => onChangePage(1)} >+</button>
                    <button onClick={onTogglePagination}>Toggle Pagination</button>
                </section>
                <button><Link to="/bug/edit">Add Bug ⛐</Link></button>
                {bugs.length && <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />}
            </main>
        </main>
    )
}
