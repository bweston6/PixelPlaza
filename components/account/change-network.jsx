function ChangeNetwork() {
  return (
    <>
      <h2>Incorrect Network</h2>
      <p>
        You need to be on the{" "}
        <a href="https://docs.polygon.technology/docs/develop/network-details/network/">
          Polygon Mainnet
        </a>{" "}
        in MetaMask to use this site.
      </p>
      <p>
        If you are unsure how to do this, follow the manual tutorial from{" "}
        <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/#add-the-polygon-network-manually">
          Polygon
        </a>
        .
      </p>
    </>
  );
}
export default ChangeNetwork;
