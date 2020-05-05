const express = require('express');

const router =express.Router();
const {check ,validationResult} =require('express-validator');
const authMiddleware = require('../../middleware/auth');
const Post =require('../../models/Post');
const User =require('../../models/User');
const Profile =require('../../models/Profile');

//@routes-  POST api/post
//@desc -   Create a post
//@acess -  Private
router.post(
    '/',
    [
        authMiddleware,
        check('text','Text is required')
        .not()
        .isEmpty()
    ],
    async (req,res)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id
            });

            const post = await newPost.save();

            res.json(post);

            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
});

//@routes-  GET api/posts
//@desc -   Get all posts
//@acess -  Private
router.get('/', authMiddleware,
async (req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1}); // sort date by recent date 
        res.json(posts);       
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

//@routes-  GET api/posts/:id
//@desc -   Get  post by id
//@acess -  Private
router.get('/:id', authMiddleware,
async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({msg:'Post not found'});
        res.json(post);       
    } catch (err) {
        console.error(err.message);
        if(err.kind = 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server Error')
    }

});

//@routes-  DELETE api/posts/:id
//@desc -   delete  post by id
//@acess -  Private
router.delete('/:id', authMiddleware,
async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({msg:'Post not found'});
        // check user 
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        } 

        await post.remove();
        res.json({msg:'Post removed'});       
    } catch (err) {
        console.error(err.message);
        if(err.kind = 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server Error')
    }

});

//@routes-  PUT api/posts/like/:id
//@desc -   Like a post
//@acess -  Private

router.put(
    '/like/:id',
    authMiddleware,
    async (req,res)=>{
        try {
            const post =await Post.findById(req.params.id);

            //Check if post has been already liked
            if(post.likes.filter(like=>like.user.toString() === req.user.id).length>0){
                return res.status(400).json({msg:'Post already liked'})
            }

            post.likes.unshift({user:req.user.id});
            await post.save();

            res.json(post.likes);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    });

//@routes-  PUT api/posts/Unlike/:id
//@desc -   dislike a post
//@acess -  Private

router.put(
    '/unlike/:id',
    authMiddleware,
    async (req,res)=>{
        try {
            const post =await Post.findById(req.params.id);

            //Check if post has been already liked
            if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({msg:'Post has not yet been liked'});
            }

            // get  remove index
            const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex ,1);
            await post.save();

            res.json(post.likes);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    });

//@routes-  POST api/posts/comment/:id
//@desc -   Comment on a post
//@acess -  Private
router.post(
    '/comment/:id',
    [
        authMiddleware,
        check('text','Text is required')
        .not()
        .isEmpty()
    ],
    async (req,res)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post =await Post.findById(req.params.id);

            const newComment ={
                text:req.body.text,
                name:user.name,
                avatar:user.avatar,
                user:req.user.id
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);

            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
});

//@routes-  DELETE api/posts/comment/:id/:comment_id
//@desc -   delete comment a post
//@acess -  Private
router.delete(
    '/comment/:id/:comment_id',
    authMiddleware,
    async (req,res)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        try {
            const post =await Post.findById(req.params.id);
            //pull out comment

            const comment =post.comments.find(comment=> comment.id === req.params.comment_id);

            //make sure comment exists
            if(!comment){
                return res.status(404).json({msg:'Comment does not exist'});
            }

            if(comment.user.toString() !== req.user.id){
                return res.status(401).json({msg:'User not authorized'});

            }

            // get  remove index
            const removeIndex = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
            post.comments.splice(removeIndex ,1);
            await post.save();

            res.json(post.comments);

            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
});
 module.exports = router;