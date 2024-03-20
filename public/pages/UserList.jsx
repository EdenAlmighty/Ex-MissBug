import { UserPreview } from "../cmps/UserPreview.jsx"
import { userService } from "../services/user.service.js"

import { showErrorMsg,showSuccessMsg } from "../services/event-bus.service.js";


const { useState, useEffect } = React

export function UserList() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then((users) => {
                setUsers(users)
                console.log(users);
            })
    }

    function onRemoveUser(userId) {
        console.log(userId);
        userService.remove(userId)
            .then(() => {
                console.log('Deleted Successfully!')
                const newUsers = users.filter((user) => user._id !== userId)
                setUsers(newUsers)
                showSuccessMsg('User removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveUser ->', err)
                showErrorMsg('Cannot remove user')
            })
    }

    return (
        <section>
            <h2>Admin Area...</h2>

            <ul className="bug-list clean-list">
                {users.map((user) => (
                    <li key={user._id}>
                        <UserPreview user={user} />
                        <section>
                            <div>
                                <button onClick={() => onRemoveUser(user._id)}>Remove</button>
                                {/* <button><Link to={`/user/edit/${user._id}`}>Edit</Link></button> */}
                            </div>
                        </section>
                    </li>
                ))}
            </ul>

        </section>
    )
}