const express = require('express');
const connectDB= require('./config/database');

const app =express();

//Connect Databases
connectDB();

//Init Middleware 
app.use(express.json({extended:false}));


app.get('/',(req,res)=>{
res.send('API Running')
});

// Defining Routes

app.use('/api/users',require('./routes/api/users'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/post'));
app.use('/api/auth',require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));