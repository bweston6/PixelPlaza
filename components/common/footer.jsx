function Footer() {
	return (
		<footer>
			<div className="container even-columns">
				<div>
					Copyright © 2022 PixelPlaza
				</div>
				<nav className="secondary-navigation" aria-label="secondary">
					<ul className="even-columns small-gap" role="list">
						<li><a href="#"><i className="fa-brands fa-instagram" /></a></li>
						<li><a href="#"><i className="fa-brands fa-tiktok" /></a></li>
						<li><a href="#"><i className="fa-brands fa-twitter" /></a></li>
						<li><a href="#">Privacy Policy</a></li>
						<li><a href="#">Terms of Service</a></li>
					</ul>
				</nav>
			</div>
		</footer>
	)
}

export default Footer
