const { useState, useEffect } = React
const { Link, useParams, useNavigate } = ReactRouterDOM
// const { useNavigate } = Reac
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {
    const navigate = useNavigate()

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch((err) => {
                // showErrorMsg('Cannot load bug', err)
                console.log('Cannot load bug', err)
                navigate('/bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return bug && <section className="bug-details">

        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <p>Severity: <span>{bug.severity}</span></p>
        <pre>Description: <span>{bug.description}</span></pre>
        <Link to="/bug">Back to List</Link>
    </section>

}

