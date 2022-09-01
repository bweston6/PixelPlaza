import DetectMetamask from "../components/account/detect-metamask"

function Login() {
	return(
		<main>
			<div className="container margin">
				<h1>Account</h1>
			</div>
			<section className="container">
				<DetectMetamask />
			</section>
		</main>
	);
}

export default Login;
