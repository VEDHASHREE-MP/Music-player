import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {
     getPlaylistByTag, 
     getSongs , 
     toggleFavourite
} from '../controllers/songController.js';
import { get } from 'mongoose';
const songRouter= express.Router();
songRouter.get("/",getSongs);
songRouter.get("/playlist/tag/:tag",getPlaylistByTag);
songRouter.post("/favourite",protect,toggleFavourite);
songRouter.get("/favourites",protect,async(req,res)=>{
    res.json(req.user.favourites);
});

export default songRouter;