
const express = require('express')
const cors = require('cors')
const { connect } = require('mongoose')

require('dotenv').config()
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const {notFound,errorHandler} = require('./middleware/errorMiddleware')
const app = express()


// Body parser MUST be before routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))

app.use('/uploads',express.static(__dirname + '/uploads'))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use(notFound)
app.use(errorHandler)
connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected")
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${process.env.PORT || 5000}`)
    })
})
.catch(error => {
    console.log("MongoDB connection error:", error)
})
