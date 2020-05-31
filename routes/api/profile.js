const express = require('express');
const request =require('request');
const config =require('config');
const router =express.Router();
const authMiddleware =require('../../middleware/auth');
const Profile =require('../../models/Profile');
const Post=require('../../models/Post');
const {check,validationResult}=require('express-validator');
const User = require('../../models/User');

//@routes-  GET api/profile/me
//@desc -   Profile status for logged in user
//@acess -  Private
router.get('/me',authMiddleware,async (req,res)=>{
    try { 
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no Profile for this user'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg:'Server Error'});
    }

});
//@routes-  post api/profile
//@desc -   Profile Update and Post
//@acess -  Private
router.post(
    '/',
    [
    authMiddleware,
    check('status','Status is required')
    .not()
    .isEmpty(),
    check('skills','Skills are required')
    .not()
    .isEmpty()
    ],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           return res.status(400).json({errors:errors.array()})
        }
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin} =req.body;
    const profileFields ={}; //init Profile fields
    profileFields.user=req.user.id;
    if(company) profileFields.company =company;
    if(website) profileFields.website =website;
    if(location) profileFields.location =location;
    if(status) profileFields.status =status;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill=>skill.trim());
    }
    if(bio) profileFields.bio =bio;
    if(githubusername) profileFields.githubusername=githubusername;
    
    profileFields.social ={}; // creating social fields
    if(youtube) profileFields.social.youtube =youtube;
    if(facebook) profileFields.social.facebook =facebook;
    if(twitter) profileFields.social.twitter =twitter;
    if(instagram) profileFields.social.instagram =instagram;
    if(linkedin) profileFields.social.linkedin =linkedin;

    try {
        // profile finding related to his/her id
        let profile = await Profile.findOne({user:req.user.id}); //user is field in profile model and 
        // user.req.id is type of user

        if(profile){ //Updating if there is id
            profile= await Profile.findOneAndUpdate({user:req.user.id},
                {$set:profileFields},
                {new:true});
            return res.json(profile);
        }
        profile =new Profile(profileFields); // Creating new profile
        await profile.save(profile);// saving profile to db

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@routes-   api/profile
//@desc -   Get all user profiles
//@acess -  Public
router
.get(
    '/',
     async (req,res)=>{
    try {
        let profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Sever Error')
        
    }
});

//@routes-   api/profile/user/user_id
//@desc -   Get profile by user id
//@acess -  Public
router
.get(
    '/user/:user_id',
     async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'Profile not found'});

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind = 'ObjectId') return res.status(400).json({msg:'Profile not found'});
        res.status(500).send('Server Error');
        
    }
});
//@routes-  api/profile
//@desc -   delete user , profile & posts
//@acess -  Private
router
.delete(
    '/',
    authMiddleware,
     async (req,res)=>{
    try {
        //remove  user post
        await Post.deleteMany({user:req.user.id});

        //remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        // remove user
        await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:'User Deleted'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

//@routes-  api/profile/experience
//@desc -   Update exprience to profile
//@acess -  Private
router
.put(
    '/experience',
    [
        authMiddleware,
        check('title','Title is required')
        .not()
        .isEmpty(),
        check('company','Company is required')
        .not()
        .isEmpty(),
        check('from','from is required')
        .not()
        .isEmpty()
    ],
    
     async (req,res)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        } 
        
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
            }= req.body;


        const newProfileExp ={
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

    try {
        const profile = await Profile.findOne({user:req.user.id});

        console.log(profile);

        profile.experience.unshift(newProfileExp); // add experience from top of array rather than end in profile model 
        
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

//@routes-  api/profile/experience/:xp_id
//@desc -   delete xp
//@acess -  Private
router
.delete(
    '/experience/:xp_id',
    authMiddleware,
     async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const indexToRemove =profile.experience.map(item=>item.id).indexOf(req.params.xp_id);
        profile.experience.splice(indexToRemove,1);
        await profile.save();

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

//@routes-  api/profile/education
//@desc -   Update education to profile
//@acess -  Private
router
.put(
    '/education',
    [
        authMiddleware,
        check('school','School is required')
        .not()
        .isEmpty(),
        check('degree','Degree is required')
        .not()
        .isEmpty(),
        check('fieldofstudy','Field of Study is required')
        .not()
        .isEmpty(),
        check('from','from is required')
        .not()
        .isEmpty()
    ],
    
     async (req,res)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        } 
        
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
            }= req.body;


        const newProfileEdu ={
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

    try {
        const profile = await Profile.findOne({user:req.user.id});

        profile.education.unshift(newProfileEdu); // add education from top of array rather than end in profile model 
        
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

//@routes-  api/profile/experience/:edu_id
//@desc -   delete xp
//@acess -  Private
router
.delete(
    '/education/:edu_id',
    authMiddleware,
     async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const indexToRemove =profile.education.map(item=>item.id).indexOf(req.params.edu_id);
        profile.education.splice(indexToRemove,1);
        await profile.save();

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

//@routes-  GET api/profile/github/:username
//@desc -   Get user repo from github
//@acess -  Public

router.get('/github/:username',async (req,res)=>{
    try {
        const options ={
            uri :`https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=
            ${config.get('githubSecretId')}`,
            method : 'GET',
            headers: {'user-agent':'node.js'}
        };

        request(options,(error,response,body)=>{
            if(error) console.error(error);
            if(response.statusCode !== 200){
                return res.status(404).json({msg:'No Github profile found for this user'});
            }

            res.json(JSON.parse(body));
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

 module.exports = router;