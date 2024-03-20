const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
    query,
    remove
}

function query() {
    return axios.get('/api/user')
        .then(res => res.data)
}

function remove(userId) {
    console.log(userId);
    return axios.delete(`/api/user/admin/${userId}`)
        .then(res => res.data)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function signup({ username, password, fullName }) {
    return axios.post('/api/auth/signup', { username, password, fullName })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullName: ''
    }
}

