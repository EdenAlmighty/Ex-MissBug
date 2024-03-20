const { useEffect, useState, useRef } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function BugEdit() {
  const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
  const inputRef = useRef()
  const navigate = useNavigate()
  const { bugId } = useParams()

  useEffect(() => {
    if (bugId) loadBug()
  }, [])

  function loadBug() {
    bugService.getById(bugId)
      .then(bug => {
        setBugToEdit(bug)
      })
      .catch((err) => {
        console.log('Had issued in bug edit:', err)
        navigate('/bug')
        showErrorMsg('Bug not found!')
      })
  }

  function handleChange({ target }) {
    const field = target.name;
    let value;

    if (field === "labels") {
      value = target.value.split(',').map(label => label.trim())
    } else if (target.type === 'number') {
      value = +target.value || ''
    } else {
      value = target.value
    }

    setBugToEdit(prevBug => ({ ...prevBug, [field]: value }))
  }

  function onSaveBug(ev) {
    console.log('onSaveBug -> ev:', ev)
    ev.preventDefault()
    bugService.save(bugToEdit)
      .then(() => {
        showSuccessMsg('Bug Saved!')
        navigate('/bug')
      })
      .catch(err => {
        console.error('Failed to save bug:', err)
        showErrorMsg('Failed to save bug')
      })
  }

  if (!bugToEdit) return <div>Loading...</div>

  const { title, description, severity, labels } = bugToEdit
  return (
    <section className="bug-edit">
      <h2>{bugToEdit._id ? 'Edit' : 'Add'} Bug</h2>

      <form onSubmit={onSaveBug}>
        <label htmlFor="title">Title:</label>
        <input
          onChange={handleChange}
          value={title}
          type="text"
          name="title"
          ref={inputRef}
          id="title"
        />

        <label htmlFor="description">Description:</label>
        <input
          onChange={handleChange}
          value={description}
          type="text"
          name="description"
          id="description"
        />

        <label htmlFor="severity">Severity:</label>
        <input
          onChange={handleChange}
          value={severity}
          type="number"
          name="severity"
          id="severity"
        />

        <label htmlFor="labels">Labels:</label>
        <input
          onChange={handleChange}
          value={labels.join(", ")} 
          type="text"
          name="labels"
          id="labels"
        />

        <button>{bugToEdit._id ? 'Save' : 'Add'}</button>
      </form>
    </section>
  )
}
