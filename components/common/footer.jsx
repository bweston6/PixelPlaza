import Link from "next/link";

function Footer() {
  return (
    <footer>
      <div className="container even-columns">
        <div>Copyright © 2022 PixelPlaza</div>
        <nav className="secondary-navigation" aria-label="secondary">
          <ul className="even-columns small-gap" role="list">
            <li>
              <a href="https://instagram.com">
                <i className="fa-brands fa-instagram" />
              </a>
            </li>
            <li>
              <a href="https://tiktok.com">
                <i className="fa-brands fa-tiktok" />
              </a>
            </li>
            <li>
              <a href="https://twitter.com">
                <i className="fa-brands fa-twitter" />
              </a>
            </li>
            <li>
              <Link href="/privacy-policy">
                <a>Privacy Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/tos">
                <a>Terms of Service</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
