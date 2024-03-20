
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

const PAGE_SIZE = 3

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy = { txt: '', severity: 0, _id }, sortBy = { type: '', description: '' }) {
    let bugsToReturn = bugs
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.title))
    }
    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.description) {
        const regex = new RegExp(filterBy.description, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.description))
    }
    if (filterBy.labels) {
        const regex = new RegExp(filterBy.labels, 'i')
        bugsToReturn = bugsToReturn.filter(bug => bug.labels.some(label => regex.test(label)))
    }
    //Sort
    if (sortBy.type === 'createdAt') {
        bugs.sort((a, b) => (+sortBy.dir) * (a.createdAt - b.createdAt))
    } else if (sortBy.type === 'severity') {
        bugs.sort((a, b) => (+sortBy.dir) * (a.severity - b.severity))
    }

    if (filterBy.pageIdx !== undefined) {
        const pageIdx = +filterBy.pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found!')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such Bug')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) {
        return Promise.reject('Not your bug!')
    }
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id);
        if (idx !== -1) {
            bugs[idx] = { ...bugs[idx], ...bug };
        }
        // if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) {
        //     return Promise.reject('Not your bug!')
        // }
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bug.labels = bug.labels?.length ? bug.labels : ['no label']
        bug.creator = loggedinUser
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

