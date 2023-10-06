import { DataTypes, Sequelize } from 'sequelize'

import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'
import passwordValidator from 'password-validator'

// Load environment variables from .env file
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

// App
const app = express()
const port = process.env.PORT || 3001

// Middleware for cors
app.use(cors())

// Middleware to parse JSON request bodies
app.use(bodyParser.json())

// Database setup with SQLite and Sequelize
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './db/e_wallet.sqlite',
})

const User = sequelize.define('User', {
	username: { type: DataTypes.STRING, unique: true },
	password: DataTypes.STRING,
	balance: { type: DataTypes.FLOAT, defaultValue: 0 },
})

const Transaction = sequelize.define('Transaction', {
	transactionType: DataTypes.STRING,
	amount: DataTypes.FLOAT,
	status: DataTypes.STRING,
})

User.hasMany(Transaction, { foreignKey: 'userId' })
Transaction.belongsTo(User, { foreignKey: 'userId' })

// Sync the database
sequelize.sync({ force: true })

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
	const token = req.header('Authorization')
	if (!token) return res.sendStatus(401)

	jwt.verify(token, SECRET_KEY, (err, user) => {
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
}

// Define a password schema with strength requirements
const passwordSchema = new passwordValidator()

// Add password requirements
passwordSchema
	.is()
	.min(8) // Minimum length of 8 characters
	.has()
	.uppercase() // Must have at least one uppercase letter
	.has()
	.lowercase() // Must have at least one lowercase letter
	.has()
	.digits(1) // Must have at least one digit
	.has()
	.not()
	.spaces() // Cannot contain spaces

// API Endpoints
app.post('/users/register', async (req, res) => {
	try {
		// Check if a user with the same username already exists
		const existingUser = await User.findOne({
			where: {
				username: req.body.username,
			},
		})

		if (existingUser) {
			return res.status(409).json({ error: 'Username already exists' })
		}

		// Check if passwords match
		if (req.body.password !== req.body.rePassword) {
			return res.status(400).json({ error: 'Passwords do not match' })
		}

		// Validate the password against the defined schema
		if (!passwordSchema.validate(req.body.password)) {
			return res.status(400).json({
				error:
					'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and cannot contain spaces.',
			})
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(req.body.password, 10)

		// Create a new user with the hashed password
		const user = await User.create({
			username: req.body.username,
			password: hashedPassword,
		})

		res.status(201).json(user)
	} catch {
		res.status(500).send()
	}
})

app.post('/users/login', async (req, res) => {
	try {
		// Find user with username
		const user = await User.findOne({
			where: { username: req.body.username },
		})

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Authenticate the user using the provided password
		if (await bcrypt.compare(req.body.password, user.password)) {
			const expiresIn = 3600 // 1 hour in seconds

			// Sign a token using JWT
			const token = jwt.sign(
				{
					username: user.username,
					id: user.id,
				},
				SECRET_KEY,
				{ expiresIn }
			)

			res.json({ token: token })
		} else {
			return res.status(401).json({ error: 'Incorrect password' })
		}
	} catch {
		res.status(500).send()
	}
})

app.get('/wallet/balance', authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id

		// Find the user by their ID
		const user = await User.findByPk(userId)

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		const balance = user.balance
		res.json({ balance })
	} catch (err) {
		console.error('Error retrieving balance:', err)
		res.status(500).send()
	}
})

app.post('/wallet/top-up', authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id
		const amount = req.body.amount

		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ error: 'Invalid amount' })
		}

		// Find the user by their ID
		const user = await User.findByPk(userId)

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Create a new transaction
		await Transaction.create({
			userId: userId,
			amount: parseFloat(amount),
			transactionType: 'top-up',
			status: 'Success',
		})

		// Update the user's balance
		const newBalance = user.balance + parseFloat(amount)
		await user.update({ balance: newBalance })

		res.json({ message: 'Top-up successful', new_balance: newBalance })
	} catch (err) {
		console.error('Error topping up wallet:', err)
		res.status(500).send()
	}
})

app.post('/wallet/pay', authenticateToken, async (req, res) => {
	try {
		const senderUserId = req.user.id
		const { recipient_username, amount } = req.body

		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ error: 'Invalid amount' })
		}

		// Find the sender by their ID
		const sender = await User.findByPk(senderUserId)

		if (!sender) {
			return res.status(404).json({ error: 'Sender user not found' })
		}

		// Find the recipient by their username
		const recipient = await User.findOne({
			where: { username: recipient_username },
		})

		if (!recipient) {
			return res.status(404).json({ error: 'Recipient user not found' })
		}

		if (sender.balance < amount) {
			return res.status(400).json({ error: 'Insufficient balance' })
		}

		// Create a new transaction
		const senderTransaction = await Transaction.create({
			userId: senderUserId,
			amount: parseFloat(amount),
			transactionType: 'payment',
			status: 'Pending',
		})
		const recipientTransaction = await Transaction.create({
			userId: recipient.id,
			amount: parseFloat(amount),
			transactionType: 'receive',
			status: 'Pending',
		})

		// Update sender's balance
		const newSenderBalance = sender.balance - parseFloat(amount)
		await sender.update({ balance: newSenderBalance })

		// Update recipient's balance
		const newRecipientBalance = recipient.balance + parseFloat(amount)
		await recipient.update({ balance: newRecipientBalance })

		// Update transaction status
		senderTransaction.update({
			status: 'Success',
		})
		recipientTransaction.update({
			status: 'Success',
		})

		res
			.status(200)
			.json({ message: 'Payment successful', new_balance: newSenderBalance })
	} catch (err) {
		console.error('Error making payment:', err)
		res.status(500).send()
	}
})

app.get('/wallet/history', authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id

		// Find the user by their ID
		const user = await User.findByPk(userId)

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Find transactions associated with the user
		const transactions = await Transaction.findAll({
			where: { userId: userId },
		})

		res.json({ transactions })
	} catch (err) {
		console.error('Error retrieving transaction history:', err)
		res.status(500).send()
	}
})

app.post('/wallet/void', authenticateToken, async (req, res) => {
	try {
		const senderUserId = req.user.id
		const { transaction_id } = req.body

		// Find the sender by their ID
		const sender = await User.findByPk(senderUserId)

		if (!sender) {
			return res.status(404).json({ error: 'Sender user not found' })
		}

		// Find the transaction by its ID
		const transaction = await Transaction.findByPk(transaction_id)

		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found' })
		}

		// Check if the sender is the owner of the transaction
		if (transaction.userId !== senderUserId) {
			return res
				.status(403)
				.json({ error: 'Unauthorized to void this transaction' })
		}

		// Check if the transaction status is 'Pending'
		if (transaction.status !== 'Pending') {
			return res
				.status(400)
				.json({ error: 'Cannot void a non-pending transaction' })
		}

		// Void the transaction by updating its status to 'Failed'
		await transaction.update({ status: 'Failed' })

		res.json({ message: 'Transaction voided' })
	} catch (err) {
		console.error('Error voiding transaction:', err)
		res.status(500).send()
	}
})

// Start the Express server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
