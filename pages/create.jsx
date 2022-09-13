import Head from "next/head";

const iframeStyle = {
  height: "80vh",
  borderStyle: "none",
  width: "min(calc(var(--body-width) + 10rem), calc(100% - 2rem))",
  marginInline: "max(calc(var(--padding-width) - 5rem), 1rem)",
};

function Create() {
  return (
    <main>
      <Head>
        <title>PixelPlaza NFT | Create</title>
      </Head>
      <section>
        <div className="container">
          <h2>Draw</h2>
          <p>Download the image as a PNG when you are finished.</p>
        </div>
        <iframe
          className="margin"
          scrolling="no"
          style={iframeStyle}
          src="https://pixilart.com/draw"
        />
      </section>
      <section className="container">
        <h2>Create</h2>
        <form>
          <style jsx>{`
            form {
              display: flex;
              flex-direction: column;
              margin-inline: auto;
              gap: 1rem;
              margin-block: 2rem;
              width: min(100%, calc(var(--body-width) / 2));
            }
            form h3,
            input[type="submit"] {
              margin-block: 0.5rem;
            }
            input[type="text"],
            textarea {
              font-size: 1rem;
              width: 100%;
              padding: 0.5rem;
              border: var(--clr-grey-300) 1px solid;
              border-radius: 0.5rem;
              font-family: system-ui;
            }
            input[type="file"] {
              display: none;
            }
            label[for="upload"] {
              cursor: pointer;
              max-width: 100%;
              width: 15rem;
              aspect-ratio: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              border: var(--clr-grey-900) dashed 0.3rem;
              border-radius: 1rem;
              font-size: 2rem;
            }
          `}</style>
          <h3>Image</h3>
          <label htmlFor="upload">
            <i className="fa-solid fa-upload" />
            <input id="upload" type="file" />
          </label>
          <label>
            <h3>Name</h3>
            <input type="text" placeholder="Image name" />
          </label>
          <label>
            <h3>External link</h3>
            <input type="text" placeholder="www.example.com" />
          </label>
          <label>
            <h3>Description</h3>
            <textarea placeholder="Provide a description of your image." />
          </label>
          <input type="submit" value="Upload" className="button" />
        </form>
      </section>
    </main>
  );
}

export default Create;
