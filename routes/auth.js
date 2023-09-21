const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { isAlreadyLoggedIn } = require('../middleware/auth')
const { rateLimit } = require('express-rate-limit')

module.exports = (app, passport) => {
	// Rate limiter
	// https://www.npmjs.com/package/express-rate-limit
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
 		//standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
		//legacyHeaders: false, // Disable the `X-RateLimit-*` headers
		//store: ... , // Use an external store for more precise rate limiting
	})
	// Apply the rate limiting middleware to all requests
	app.use('/api/auth', limiter, router)
	router.post('/register', authController.registerNewUser)
	router.get('/login', isAlreadyLoggedIn)
	router.post('/login', passport.authenticate('local'), async (req, res) => {
		const user = req.user
		if (!user) {
			// we didnt get a user back from passport authenticate
			res.status(401).send('Incorrect username or password')
		}
		req.session.user = user
		res.status(200).send(user)
	})
	router.post('/logout', authController.logout)
}
