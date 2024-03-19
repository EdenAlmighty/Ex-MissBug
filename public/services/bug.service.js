
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}

function query(filterBy = {}) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
            }
            if (filterBy.severity) {
                // const regExp = new RegExp(filterBy.severity, 'i')
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            return bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
        .then(res => res.data)
}

function getEmptyBug() {
    return { title: '', description: '', severity: 5 }
}

function getDefaultFilter() {
    return { txt: '', severity: '' }
}


//* Easier way to destructure query params
function save(bug) {
    const url = BASE_URL + 'save'
    // Destructure the query params
    const { title, description, severity } = bug

    // Create object with destructured data
    const queryParams = { title, description, severity }

    if (bug._id) queryParams._id = bug._id

    return axios.get(url, { params: queryParams })
    // .then(res => res.data)
}

//! LONG WAY
// function save(bug) {
//     console.log(bug)
//     const url = BASE_URL + 'save'
//     let queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
//     if (bug._id) queryParams += `&_id=${bug._id}`
//     return axios.get(url + queryParams)
//         // .then(res => res.data)
// }


function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
