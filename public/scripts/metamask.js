// borrowed from https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(_chainId) {
	// We recommend reloading the page, unless you must do otherwise
	window.location.reload();
}

/***********************************************************/
/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

// Note that this event is emitted on page load.
// If the array of accounts is non-empty, you're already
// connected.
ethereum.on('accountsChanged', handleAccountsChanged);

// For now, 'eth_accounts' will continue to always return an array
// currentAccount is created using react state
function handleAccountsChanged() {
	location.reload()
}
