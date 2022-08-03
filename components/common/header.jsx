function Header() {
	return (
		<header>
			<div className="container even-columns small-gap">
				<a className="even-columns logo small-gap" href="/">
					<div className="circle"></div>
					PIXELPLAZA
				</a>
				<input type="text" placeholder="⌕ Search" className="search-bar"></input>
				<nav className="primary-navigation" aria-label="primary">
					<ul className="even-columns small-gap" role="list">
						<li><a href="/browse.html">Browse</a></li>
						<li><a href="/create.html">Create</a></li>
						<li><a href="/login.html"><i className="fa-solid fa-user-large clr-accent-yellow"></i></a></li>
					</ul>
				</nav>
			</div>
		</header>
	)
}

export default Header
