// import styles from '../styles/Home.module.css'
import Head from "next/head";
import Link from "next/link";
import Nfts from "../components/nft/nfts.jsx";

function Home() {
  return (
    <main>
      <Head>
        <title>PixelPlaza NFT | Home</title>
      </Head>
      <section className="clr-accent-gradient">
        <div className="container">
          <h2>Latest</h2>
        </div>
        <div className="scroller">
          <Nfts />
        </div>
        <div className="container margin">
          <Link href="/browse">
            <a className="button">Browse Now</a>
          </Link>
        </div>
        <div className="container">
          <h3>We Promote the Little Guy</h3>
          <p>
            Non interdum nibh enim eget augue. Sed mauris. Nam varius odio a
            sapien. Aenean rutrum dictum sapien. Fusce pharetra elementum
            ligula. Nunc eu mi non augue iaculis facilisis. Morbi interdum.
            Donec nisi arcu, rhoncus ac, vestibulum ut, pellentesque nec, risus.
            Maecenas tempus facilisis neque. Nulla mattis odio vitae tortor.
            Fusce iaculis. Aliquam rhoncus, diam quis tincidunt facilisis, sem
            quam luctus augue, ut posuere neque sem vitae neque.
          </p>
          <Link href="/create">
            <a className="button">Create Now</a>
          </Link>
        </div>
      </section>
      <section>
        <div className="box container even-columns center">
          <div className="wrap-text">
            <h2>Low Fees</h2>
            <p>
              Eget gravida blandit, urna lacus faucibus velit, in consectetuer
              sapien erat nec quam. Integer bibendum odio sit amet neque.
              Integer imperdiet rhoncus mi. Pellentesque malesuada purus id
              purus. Quisque viverra porta lectus. Sed lacus leo, feugiat at,
              consectetuer eu, luctus quis, risus. Suspendisse faucibus orci et
              nunc. Nullam vehicula fermentum risus. Fusce felis nibh, dignissim
              vulputate, ultrices quis, lobortis et, arcu. Duis aliquam libero
              non diam.
            </p>

            <p>
              Vestibulum placerat tincidunt tortor. Ut vehicula ligula quis
              lectus. In eget velit. Quisque vel risus. Mauris pede. Nullam
              ornare sapien sit amet nisl. Cras tortor. Donec tortor lorem,
              dignissim sit amet, pulvinar eget, mattis eu, metus.{" "}
            </p>
          </div>
          <i
            style={{ fontSize: "96px" }}
            className="fa-solid fa-hand-holding-dollar"
          ></i>
        </div>
      </section>
      <section className="polygon">
        <div className="container even-columns center">
          <img
            style={{ width: "96px", aspectRatio: "1" }}
            alt="polygon logo"
            src="/images/polygon.svg"
          />
          <div className="wrap-text">
            <h2>Backed by Polygon & Etherium</h2>
            <p>
              Proin tempus diam ut ligula. Mauris dictum, metus dapibus iaculis
              sollicitudin, leo ligula cursus sem, eu congue metus ligula sed
              justo. Suspendisse potenti. Donec sodales elementum turpis. Duis
              dolor elit, dapibus sed, placerat vitae, auctor sit amet, nunc.
              Donec nisl quam, hendrerit vitae, porttitor et, imperdiet id,
              quam. Quisque dolor. Nulla tincidunt, lacus id dapibus
              ullamcorper, turpis diam fringilla eros, quis aliquet dolor felis
              at lorem. Pellentesque et lacus. Vestibulum tempor lectus at est.
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Sed vitae eros. Nulla pulvinar
              turpis eget nunc. Sed bibendum pellentesque nunc. Integer
              tristique.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h2>Getting Started</h2>
          <div className="even-columns margin-top">
            <div className="box wrap-text">
              <h3>Setting Up Your Wallet</h3>
              <p>
                Nunc massa, dapibus quis, imperdiet id, commodo a, lacus. Cras
                sit amet erat et nulla varius aliquet. Aliquam erat volutpat.
                Praesent feugiat vehicula pede. Suspendisse pulvinar, orci in
                sollicitudin venenatis, nibh libero hendrerit sem, eu tempor
                nisi felis et metus. Etiam gravida sem ut mi. Integer volutpat,
                enim eu varius gravida, risus urna venenatis lectus, ac ultrices
                quam nulla eu leo. Duis arcu. Class aptent taciti sociosqu ad
                litora torquent per conubia nostra, per inceptos himenaeos.
              </p>

              <p>
                Vivamus lacus libero, aliquam eget, iaculis quis, tristique
                adipiscing, diam. Vivamus nec massa non justo iaculis
                pellentesque. Aenean accumsan elit sit amet nibh feugiat semper.
                Cras.
              </p>
            </div>
            <div className="box wrap-text">
              <h3>Creating an Account</h3>
              <p>
                Hendrerit non, sem. Vivamus dignissim massa in ipsum. Morbi
                fringilla ullamcorper ligula. Nunc turpis. Mauris vitae sapien.
                Nunc luctus bibendum velit.
              </p>

              <p>Aliquam aliquam dolor at.</p>
              <Link href="/login">
                <a className="button">Sign Up</a>
              </Link>
            </div>
            <div className="box wrap-text">
              <h3>Uploading Your Art</h3>
              <p>
                Hendrerit non, sem. Vivamus dignissim massa in ipsum. Morbi
                fringilla ullamcorper ligula. Nunc turpis. Mauris vitae sapien.
                Nunc luctus bibendum velit.
              </p>

              <p>Aliquam aliquam dolor at.</p>
              <Link href="/create">
                <a className="button">Create</a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
