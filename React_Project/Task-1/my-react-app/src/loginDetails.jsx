import './index.css';
function Details() {
    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <a href="/" className="nav-logo">MyProject</a>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <a href="/" className="nav-link">Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="/about" className="nav-link">About</a>
                        </li>
                        <li className="nav-item">
                            <a href="/contact" className="nav-link">Contact</a>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link">Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <h2>Details of Project</h2>
        </>
    );
}

export default Details;