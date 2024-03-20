const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { Team } from './cmps/Team.jsx'
import { Vision } from './cmps/Vision.jsx'
import { BugEdit } from './pages/BugEdit.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { UserList } from './pages/UserList.jsx'
// import { BugFilter } from './cmps/BugFilter.jsx'

export function App() {
    return (
        <Router>
            <div>
                <AppHeader />
                {/* <BugFilter/> */}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} >
                            <Route path="team" element={<Team />} />
                            <Route path="vision" element={<Vision />} />
                        </Route>
                        <Route path="/bug" element={<BugIndex />} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        <Route path="/bug/edit/" element={<BugEdit />} />
                        <Route path="/bug/edit/:bugId" element={<BugEdit />} />
                        <Route path="/user/:userId" element={<UserDetails />} />
                        <Route path="/user/admin" element={<UserList />} />
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Router>
    )
}
