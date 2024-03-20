import { BugList } from "../cmps/BugList.jsx"

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from "../services/event-bus.service.js";
import { userService } from "../services/user.service.js";

const { useState, useEffect } = React

export function UserDetails() {
    const [bugs, setBugs] = useState([])

    const user = userService.getLoggedinUser()

    useEffect(() => {
        loadBugs()
    }, [])

    function loadBugs() {
        bugService.query()
            .then((bugs) => {
                const userBugs = bugs.filter((bug) => bug.creator._id === user._id)
                setBugs(userBugs)
            })
            .catch((err) => {
                showErrorMsg('Cannot find user bugs')
            })
    }

    return (
        <section>
            <h2>User Bugs</h2>
            <BugList bugs={bugs} />
        </section>
    )
}