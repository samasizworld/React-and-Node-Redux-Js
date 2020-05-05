const express = require('express');
const { check ,validationResult} =require('express-validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken'); 
const User =require('../../models/User');
const router =express.Router();
const gravatar =require('gravatar');
const config = require('config');


//@routes-  POST api/users
//@desc -   Register users
//@acess -  Public
router.post(
    '/',
    [
        check('name','Name is required')
        .not()
        .isEmpty(),
        check('email','Please enter a valid email')
        .isEmail(),
        check('password','Please enter password with 6 or more characters')
        .isLength({min:6})
    ],
        async(req,res)=>{
            const errors =validationResult(req);
            // if any of above doesnt match
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
            }


            const {name ,email,password}=req.body; // Destructuring the req.body 
            try{
                //See if User exists
                let user = await User.findOne({email}); //find Users by its email
                if(user){
                    return res.status(400).json({errors:[{msg:'User already exists'}] });
                }


                //Gets User Gravatar based on email

                const avatar = gravatar.url(email,{
                    size:'200',
                    rating:'pg',
                    default:'mm'
                });

                user = new User({
                    name,
                    email,
                    avatar,
                    password
                })


                 //Encrypt Password

                 const salt = await bcrypt.genSalt(10); // it gives promise so that we use await
                 user.password=await bcrypt.hash(password,salt);

                 await user.save();


                //Return jsonwebtoken (i.e user gets immediately after register in FrontEnd)

                const payload ={
                    user:{
                        id:user.id
                    }
                }
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    {expiresIn:360000},
                    (err,token)=>{
                        if(err) throw err;
                        res.json({token});
                    });
            } catch(err){

                console.error(err.message);
                req.status(500).send('Server Error')

            }
         });


 module.exports = router;