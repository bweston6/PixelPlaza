import Link from "next/link";

function Header() {
	return (
		<header>
			<div className="container even-columns small-gap">
				<Link href="/">
					<a className="even-columns logo small-gap">
						<img className="circle" alt="logo" src="/images/logo.svg" />
						PIXELPLAZA
					</a>
				</Link>
				<input type="text" placeholder="⌕ Search" className="search-bar"></input>
				<nav className="primary-navigation" aria-label="primary">
					<ul className="even-columns small-gap" role="list">
						<li><Link href="/browse"><a>Browse</a></Link></li>
						<li><Link href="/create"><a>Create</a></Link></li>
						<li><Link href="/login"><a><i className="fa-solid fa-user-large clr-accent-yellow"></i></a></Link></li>
					</ul>
				</nav>
			</div>
		</header>
	)
}

export default Header
