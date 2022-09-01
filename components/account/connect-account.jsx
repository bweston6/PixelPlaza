function ConnectAccount() {
	/*********************************************/
	/* Access the user's accounts (per EIP-1102) */
	/*********************************************/

	// While you are awaiting the call to eth_requestAccounts, you should disable
	// any buttons the user can click to initiate the request.
	// MetaMask will reject any additional requests while the first is still
	// pending.
	function connect() {
		ethereum
			.request({ method: 'eth_requestAccounts' })
			.then(handleAccountsChanged)
			.catch((err) => {
				if (err.code === 4001) {
					// EIP-1193 userRejectedRequest error
					// If this happens, the user rejected the connection request.
					console.log('Please connect to MetaMask.');
				} else {
					console.error(err);
				}
			});
	}

	return(
		<>
		<h2>Connect Your Account</h2>
		<div className="box margin">
		<div className="h-center-align">
		<img alt="metamask" className="circle" src="/images/metamask.svg" />
		<h3>MetaMask</h3>
		</div>
		<p>Connect your MetaMask account.</p>
		<button onClick={connect} className="button">Connect</button>
		</div>
		</>
	);
}
export default ConnectAccount;
