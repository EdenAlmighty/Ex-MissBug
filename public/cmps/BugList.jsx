const { Link } = ReactRouterDOM
import { userService } from "../services/user.service.js";
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug }) {

  const user = userService.getLoggedinUser()

  function isOwner(bug) {
    // console.log(bug.creator._id );
    if (!user) return false
    // if (!bug.creator) return true
    return user.isAdmin || bug.creator._id === user._id
  }

  if (!bugs) return <div>Loading...</div>
  console.log(bugs);

  return (
    <ul className="bug-list clean-list">
      {bugs.map((bug) => (
        <li key={bug._id}>
          <BugPreview bug={bug} />
          <section>
            <button>
              <Link to={`/bug/${bug._id}`}>Details</Link>
            </button>
            {
              isOwner(bug) &&
              <div>
                <button onClick={() => onRemoveBug(bug._id)}>Remove</button>
                <button><Link to={`/bug/edit/${bug._id}`}>Edit</Link></button>
              </div>
            }
          </section>
        </li>
      ))}
    </ul>
  )
}
