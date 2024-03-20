export function UserPreview({ user }) {

    if (!user) return <div>Loading...</div>

    return <article className="bug-preview user-preview">

        <h4>{user.fullName}</h4>
        <h1>😎</h1>
        <p>id: <span>{user._id}</span></p>
        {/* {user.isAdmin  && <p>Admin: <span>{user.isAdmin}</span></p>} */}

    </article>
}