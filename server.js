const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize=require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp=require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//load var
dotenv.config({path:'./config/config.env'});

//connect database
connectDB();

const app = express();
//BODY PARSER
app.use(express.json());
//cookieparser
app.use(cookieParser());
//sanitize data
app.use(mongoSanitize());
//set security header
app.use(helmet());
//set security header
app.use(xss());
//rate limiting
const limiter=rateLimit({windowsMs:10*60*1000,max:100}); //10 mins
app.use(limiter);
//prevent http param pollutions
app.use(hpp());
//enable cors
app.use(cors());

const swaggerOptions = {
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title:'Library API',
            version:'1.0.0',
            description:'A simple Express VacQ API'
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1'
            }
        ]
    },
    apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

// app.get('/',(req,res) => {
//     //res.send('<h1>Hello from express</h1>');
//     //res.send({name:'Brad'});
//     //res.json({name:'Brad'});
//     //res.sendStatus(400);
//     //res.status(400).json({success:false});
//     res.status(200).json({success:true,data:{id:1}});
// });


// app.get('/api/v1/hospitals',(req,res) => {
//     res.status(200).json({success:true,msg:'Show all hospitals'});
// });

// app.get('/api/v1/hospitals/:id', (req,res) => {
//     res.status(200).json({success:true,msg:`Show hospital ${req.params.id}`});
// });

// app.post('/api/v1/hospitals/', (req,res) => {
//     res.status(200).json({success:true,msg:'Create new Hospital'});
// });

// app.put('/api/v1/hospitals/:id',(req,res) => {
//     res.status(200).json({success:true,msg:`Update hospital ${req.params.id}`});
// });

// app.delete('/api/v1/hospitals/:id' , (req,res) => {
//     res.status(200).json({success:true,msg:`Delete hospital ${req.params.id}`});
// });

//Rout files
const hospitals = require('./routes/hospitals');
app.use('/api/v1/hospitals',hospitals);

const auth = require('./routes/auth');
app.use('/api/v1/auth',auth);

const appointments = require('./routes/appointments');
app.use('/api/v1/appointments',appointments);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log('Server running in ',process.env.NODE_ENV,' mode on port ',PORT));

//handle unhandle promise rejections
process.on('unhandleRejection',(err,promise)=>{
    console.log(`Error:${err.message}`);
    server.close(()=>process.exit(1));
});