# PixelPlaza

Pixel Plaza is a legendary marketplace for selling your pixel art NFTs. Draw, buy, sell - the world's best pixel art NFT marketplace.

## Deploy Locally
To run the server locally:

1. Install all dependencies using npm:

	```
	$ npm install
	```
1. Run a local JSON-RPC server using:
	
	```
	$ npx hardhat node
	```
	
	---
	You should keep this open while running the server.

	---
1. Deploy the app keys to the JSON-RPC server:
	
	```
	$ npx hardhat run scripts/deploy.js --network localhost
	```
1. Run the server using:
	
	```
	$ npm run dev
	```

Open http://localhost:3000 with your browser to see the result.

## Branding
* Site branding assets such as logos are stored in [public/images](https://github.com/bweston6/PixelPlaza/tree/dev-backend/public/images).
* The company name should be stylised as "PixelPlaza".
* Company branding, including logo and name, should be represented such that contrast with the background is WCAG AAA compliant.
* Company branding should be coloured in combinations of:

	| Logo | Company Name |
	| :-- | :-- |
	| `--clr-accent-yellow` | `--clr-accent-yellow` |
	| `--clr-accent-yellow` | `--clr-grey-900` |
	| `--clr-grey-900` | `--clr-grey-900` |
	| `--clr-grey-100` | `--clr-grey-100` |
* Brand colour are as follows:
	
	```css
	--clr-accent-yellow: hsl(52, 96%, 69%);
	--clr-accent-blue: hsl(172, 23%, 68%);
	--clr-accent-salmon: hsl(7, 80%, 64%);
	--clr-grey-100: hsl(0, 0%, 10%);
	--clr-grey-300: hsl(0, 0%, 15%);
	--clr-grey-500: hsl(0, 0%, 50%);
	--clr-grey-700: hsl(0, 0%, 70%);
	--clr-grey-900: hsl(0, 0%, 100%);
	```
	
	where `--clr-accent-yellow` is the main brand colour, other accent colours are for minimal decoration, and greys are for backgrounds and text.