import Link from "next/link";

export default function Navbar({ menus }) {
    return (
        <nav className="navbar navbar-expand-lg bg-light fixed-top">
            <div className="container-fluid">
                <Link href="/">
                    <a className="navbar-brand">Home</a>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/exchange-rate-calculator">
                                <a className="nav-link active">
                                    Calculator
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/exchange-rate">
                                <a className="nav-link active">Exchange Rate</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
