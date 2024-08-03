const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth');
const roleRoutes = require('./routes/role');
const permissionRoutes = require('./routes/permission');
const productRoutes = require('./routes/product')
const categoryRoutes = require('./routes/categories')
const orderRoutes = require('./routes/order')
const expressWinston = require('express-winston');
const logger = require('./config/logger');
const connectDB = require('./config/db')
const cors = require('cors');
const morgan = require('morgan');
;

const {errorHandler,AppError} = require('./middleware/errorHandler')

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true}));
const PORT = process.env.PORT;

// request and response logging
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; } 
  }));


app.use('/api/auth', authRoutes)
app.use('/api', userRoutes)
app.use('/api', roleRoutes)
app.use('/api', permissionRoutes)
app.use('/api', productRoutes)
app.use('/api', categoryRoutes)
app.use('/api', orderRoutes)



// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new AppError('Not Found', 404))
})

// Error logging
app.use(expressWinston.errorLogger({
    winstonInstance: logger
  }));

//Error handling Middleware
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler);


const start = async () => {
    try {

        await connectDB(process.env.MONGODB_URI)
        app.listen(PORT, () => {
            console.log(`server running http://localhost:${PORT}`)
        }) 

    } catch(error) {
        console.log(error)
    }
}

start()


