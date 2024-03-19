import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { Link, useSearchParams } = ReactRouterDOM

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    // const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams) || {})
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    // const [searchParams, setSearchParams] = useSearchParams()


    useEffect(() => {
        // setSearchParams(filterBy)
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        // bugService.query().then(setBugs)
        // bugService.query(filterBy).then(setBugs)
        bugService.query(filterBy).then((bugs) => setBugs(bugs))

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

    function onSetFilter(filterBy) {
        setFilterBy((prevFilterBy) => ({...prevFilterBy, ...filterBy}))
      }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?'),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
            // bugService
            .save(bugToSave)
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

    const { txt, severity } = filterBy
    
    return (
        <main>
            <h3>Bugs App</h3>
            {filterBy && <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />}
            {/* <BugFilter
                onSetFilter={onSetFilter}
                filterBy={{ txt, severity }} /> */}

            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
