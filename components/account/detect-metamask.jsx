import GetMetamask from "./get-metamask";
import ConnectAccount from "./connect-account";
import Account from "./account";
import ChangeNetwork from "./change-network";

import Script from "next/script";

import { useEffect } from "react";
import { useState } from "react";

import axios from "axios";

function DetectMetamask() {
  // get ethereum object from metamask
  const [ethereum, setEthereum] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    // set ethereum object
		if (window.ethereum) {
			setEthereum(window.ethereum);
			// get account object
			const fetchAccount = async () => {
				const accounts = await window.ethereum.request({
					method: "eth_accounts",
				});
				if (accounts.length > 0 && accounts[0] !== currentAccount) {
					setCurrentAccount(accounts[0]);
				}
			};
			fetchAccount().catch((err) => {
				// Some unexpected error.
				// For backwards compatibility reasons, if no accounts are available,
				// eth_accounts will return an empty array.
				console.error(err);
			});
		} else {
			setEthereum(null);
		}
	}, []);

	if (ethereum == null || ethereum.isMetaMask == false) {
		return (
			<>
			<Script src="/scripts/metamask.js" />
			<GetMetamask />
			</>
		);
	}
	// todo - change to polygon mainnet
	if (ethereum.chainId != "0x539") {
		return (
			<>
			<Script src="/scripts/metamask.js" />
			<ChangeNetwork />
			</>
		);
	}
	if (currentAccount == null) {
		return (
			<>
			<Script src="/scripts/metamask.js" />
			<ConnectAccount />
			</>
		);
	}
	// create account and return account page
	axios
		.post("/api/createUser", {
			walletId: currentAccount,
		})
		.catch(function (error) {
			if (error.response.status != 409) {
				throw error;
			}
		});

	return (
		<>
		<Script src="/scripts/metamask.js" />
		<Account currentAccount={currentAccount} />
		</>
	);
}

export default DetectMetamask;
