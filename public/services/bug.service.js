const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug,
    getFilterFromParams
}

function query(filterBy, sortBy) {
    const queryParams = { ...filterBy, ...sortBy }
    return axios.get(BASE_URL, { params: queryParams })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(bug) {
    console.log(bug);
    if (bug._id) {
        return axios.put(BASE_URL, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        txt: searchParams.get('txt') || defaultFilter.txt,
        severity: searchParams.get('severity') || defaultFilter.severity,
        desc: searchParams.get('description') || defaultFilter.description,
        labels: searchParams.get('labels') || defaultFilter.labels
    }
}

function getEmptyBug() {
    return { title: '', description: '', severity: 0, labels: [] }
}

function getDefaultFilter() {
    return { txt: '', description: '', severity: 0, labels: [] }
}