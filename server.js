import { bugService } from './services/bug.service.js';
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js';

import cookieParser from 'cookie-parser';
import express from 'express'
import path from 'path'

const app = express()

app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())


// Get bugs (READ)
app.get('/api/bug', (req, res) => {

    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        description: req.query.description || '',
        _id: req.query._id || '',
        //TODO: try []
        labels: req.query.labels || '',
        pageIdx: req.query.pageIdx
    }

    const sortBy = {
        type: req.query.type || '',
        dir: +req.query.dir || 1
    }

    //! Not sure I need this..
    // if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx


    bugService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Create Bug 
app.post('/api/bug', (req, res) => {
    // console.log(req.body)
    // const bugToSave = { ...req.body, labels: ['test', 'label'] }
    // if (!Array.isArray(req.body.labels)) {
    //     req.body.labels = [];
    // }
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const bugToSave = req.body
    bugService.save(bugToSave, loggedinUser)
        .then((bug) => {
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(401).send('Cannot get bugs')
        })
})

// Update Bug
app.put('/api/bug', (req, res) => {

    //* req.query is what axios receives in data
    //* Best practice not to destruct via possibility of more data
    // const bugToSave = {
    //     title: req.body.title,
    //     severity: +req.body.severity,
    //     description: req.body.description,
    //     _id: req.body._id,
    //     createdAt: req.body.createdAt,
    //     labels: (req.body.labels.length) ? req.body.labels : []
    // }
    const loggedinUser = userService.validateToken(req.cookies.loginToken)

    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const bugToSave = req.body
    // console.log('&&&&&&&&&&&&&', bugToSave);
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error("Cannot save bug", err)
            res.status(401).send("Cannot save bug")
        })
})

// Get bug (READ)
app.get("/api/bug/:bugId", (req, res) => {
    // const bugId = req.params.id
    const { bugId } = req.params
    const { visitedBugs = [] } = req.cookies



    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        else visitedBugs.push(bugId)
    }

    //* Reset cookies after 7 seconds
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 * 1 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Cannot get bug")
        })
})

//Remove Bug
app.delete('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot  remove bug')
    const bugId = req.params.id
    console.log(bugId);
    bugService.remove(bugId, loggedinUser)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error("Cannot remove bug", err)
            res.status(400).send("Cannot remove bug")
        })
})


// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:id', (req, res) => {
    userService.getById()
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/admin/:id', (req, res) => {
    const userId = req.params.id
    
    userService.remove(userId)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})
// const port = 3040
// app.listen(port, () =>
//     loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
// )

const PORT = process.env.PORT || 3040
app.listen(PORT,
    () => console.log(`Server listening on port ${PORT}`))