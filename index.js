const express= require('express');
const dotenv= require("dotenv");
const productRoutes = require('./routes/productRoutes');
const error = require('./middlewares/errorMiddlewareHandler');
const cors = require('cors')
//db Connection
dotenv.config();
require('./config/dbconnect')();



const app = express();
app.use(cors({origin: true, credentials: true}));



app.use(express.json());



//routes
app.use('/api/product',productRoutes)



//error Middleware
app.use(error.errorMiddlewareHandler);

//server
const PORT = process.env.PORT||5000;
app.listen(PORT,(req , res)=>{
    console.log(`Server is Up and Running ${PORT}`);
});