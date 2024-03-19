const {Link} = ReactRouterDOM

import {BugPreview} from './BugPreview.jsx'

export function BugList({bugs, onRemoveBug}) {
  return (
    <ul className="bug-list clean-list">
      {bugs.map((bug) => (
        <li key={bug._id}>
          <BugPreview bug={bug} />
          <section>
            <button onClick={() => onRemoveBug(bug._id)}>Remove</button>
            <button>
              <Link to={`/bug/${bug._id}`}>Details</Link>
            </button>
            <button>
              <Link to={`/bug/edit/${bug._id}`}>Edit</Link>
            </button>
          </section>
        </li>
      ))}
    </ul>
  )
}
