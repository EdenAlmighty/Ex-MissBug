export function BugPreview({ bug }) {

    if (!bug) return <div>Loading...</div>

    return <article className="bug-preview">

        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        {bug.labels && bug.labels.length > 0 && <p>Labels: <span>{bug.labels.join(', ')}</span></p>}

    </article>
}