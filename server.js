const app = require('./index')
require('dotenv').config({
  path: '../.env',
})

const { PORT } = require('./config')

// app.get('/', (req, res, next) => {
//   if (req.user) {
//     res.status(200).json(req.user)
//   } else {
//     res.status(200).json("The root says you're not logged in! :)")
//   }
// })

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`)
})
