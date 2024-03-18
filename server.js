// import { utilService } from './services/utils.service.js';
import { bugService } from './services/bug.service.js';
import { loggerService } from './services/logger.service.js';

import cookieParser from 'cookie-parser';
import express from 'express'

const app = express()
app.use(express.static("public"))
app.use(cookieParser())

app.get('/api/bugs/:id', (req, res) => {
    let arrVisited = req.cookies.arrVisited ? JSON.parse(req.cookies.arrVisited) : []
    const bugId = req.params.id
    
    let bugCount = req.cookies.bugCount ? parseInt(req.cookies.bugCount) : 0
    res.cookie('bugCount', ++bugCount, { maxAge: 7000 })

    console.log('bugCount:', bugCount)
    if (bugCount > 3) {
        return res.status(401).send('Wait for a bit')
    }

    bugService.getById(bugId)
        .then(bug => {
            //! This doesn't work
            if (!arrVisited.includes(bugId)) {
                arrVisited.push(bugId)
                res.send(bug)
            }
        })
        .catch(err => {
            loggerService.error(err)
            res.status(400).send('Cannot get bug')
        })
})

// Get bugs (READ)
app.get('/api/bugs', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bugs/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        _id: req.query._id,
        createdAt: req.query.createdAt
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error("Cannot save bug", err)
            res.status(400).send("Cannot save bug")
        })
})

app.get("/api/bugs/:id", (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Cannot get bug")
        })
})

//Remove Bug
app.get('/api/bugs/:id/remove', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error("Cannot remove bug", err)
            res.status(400).send("Cannot remove bug")
        })
})
// console.log(bugService.bugs); 









const port = 3040
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)