import GetMetamask from "./get-metamask"
import ConnectAccount from "./connect-account"
import Account from "./account"
import ChangeNetwork from "./change-network"

import { useEffect } from "react"
import { useState} from "react"


function DetectMetamask() {
	// get ethereum object from metamask
	const [ethereum, setEthereum] = useState(null)
	const [currentAccount, setCurrentAccount] = useState(null)

	function handleAccountsChanged(accounts) {
		if (accounts.length === 0) {
			// MetaMask is locked or the user has not connected any accounts
			console.log('Please connect to MetaMask.');
		} else if (accounts[0] !== currentAccount) {
			setCurrentAccount(accounts[0]);
		}
	}


	useEffect(() => {
		setEthereum(window.ethereum)
	}, [])

	useEffect(() => {
		const ethereum = window.ethereum;

		/***********************************************************/
		/* Handle user accounts and accountsChanged (per EIP-1193) */
		/***********************************************************/
		ethereum
			.request({ method: 'eth_accounts' })
			.then(handleAccountsChanged)
			.catch((err) => {
				// Some unexpected error.
				// For backwards compatibility reasons, if no accounts are available,
				// eth_accounts will return an empty array.
				console.error(err);
			});

		// Note that this event is emitted on page load.
		// If the array of accounts is non-empty, you're already
		// connected.
		ethereum.on('accountsChanged', handleAccountsChanged);

		// For now, 'eth_accounts' will continue to always return an array
	}, [])

	if (ethereum == null || ethereum.isMetaMask == false) {
		return(<GetMetamask />);
	}
	// todo - change to polygon mainnet
	if (ethereum.chainId != "0x539") {
		return(<ChangeNetwork />)
	}
	if (currentAccount == null) {
		return(<ConnectAccount />);
	}
	return(<Account />);
}

export default DetectMetamask;
