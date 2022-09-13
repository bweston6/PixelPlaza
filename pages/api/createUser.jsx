import { prisma } from "prisma/db.ts"

async function prismaCheckUser(walletId) {
	return await prisma.$exists.user({
		walletId: user.walletId,
	});
}

async function prismaCreateUser(walletId) {
	await prisma.user.create({
		data : {
			walletId: walletId,
			username: walletId,
		},
	});
}

export default function createUser(req, res) {
	// check for correct http method
	if (req.method !== "POST") {
		res.status(405).json({ error: "method not allowed" })
	}

	// check for correct data
	const user = req.body
	if (!user.hasOwnProperty("walletId")) {
		res.status(422).json({ error: 'missing "walletId" in data' })
	}

	// check for existing user
	const userExists = prismaCheckUser(user.walletId)
		.then(async () => {
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			res.status(500).json({ error: "database error" });
			await prisma.$disconnect()
		});
	if (userExists) {
		res.status(409).json({ error: "user already exists" })
	}

	// create user
	prismaCreateUser(user.walletId)
		.then(async () => {
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			res.status(500).json({ error: "database error" });
			await prisma.$disconnect()
		});
	res.status(201).json({ message: "user created" })
}
