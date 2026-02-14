import React, { useEffect, useState } from "react";

import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";

import "../css/pages/HomePage.css";
import { useSelector } from "react-redux";
import axios from "axios";
import useAudioPlayer from "../hooks/useAudioPlayer";
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs,setSongs]= useState([]);
const [searchSongs, setSearchSongs]= useState([]);
const [openEditProfile, setOpenEditProfile]= useState(false);
const auth= useSelector((state) => state.auth);
 
const songsToDisplay = view=== "search" ? searchSongs : songs;
const {audioRef, currentIndex, currentSong, isPlaying, currentTime, duration, isMuted, loopEnabled, shuffleEnabled, playbackSpeed, volume, playSongAtIndex,  handleTogglePlay, handleNext, handleTogggleMute, handlePrev, handleTimeUpdate, handleLoadedMetadata, handleEnabled, handleTogggleLoop, handleTogggleShuffle, handleChangeSpeed, handleSeek, handleChangeVolume,} = useAudioPlayer(songsToDisplay);

const playerState={
  currentSong, 
  isPlaying, 
  currentTime, 
  duration, 
  isMuted, 
  loopEnabled, 
  shuffleEnabled, 
  playbackSpeed, 
  volume,
}
const playerControls ={
  playSongAtIndex,
  handleTogglePlay,
  handleNext,
  handlePrev,
  handleSeek,
}
const playerFeatures={
  onToggleMute: handleTogggleMute,
  onToggleLoop: handleTogggleLoop,
  onToggleShuffle: handleTogggleShuffle,
  onChangeSpeed: handleChangeSpeed,
  onChangeVolume: handleChangeVolume,
}
useEffect(() => {
  const fetchInitialSongs = async() =>{
     
      try {
        const res = await axios.get("http://localhost:5000/api/songs");
        setSongs(res.data.results || []);

      } catch (error) {
        console.error("Error fetching songs:", error);
        setSongs([]);
      }
      };
       fetchInitialSongs();
},[])


const loadPlaylist= async(tag)=>{
  if (!tag){
    console.warn("No tag is provided");
    return;
  }
  try {
        const res = await axios.get(`http://localhost:5000/api/songs/playlist/tag/${tag}`);
        setSongs(res.data.results || []);

         
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setSongs([]);
      }
};
    
const handleSelectSong= (index) => {
  playSongAtIndex(index);
}

const handlePlayFavourite =(song) =>{
  const favourites =auth.user?.favourites || [];
  if (!favourites.length) return;
  const index= auth.user.favourites.findIndex((fav) => fav.id === song.id);
  setSongs(auth.user.favourites);
  setView("home");
  setTimeout(()=>{
    if (index != -1){
      playSongAtIndex(index);
    }
  },0);
};

return (
    <div className="homepage-root">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnabled}>{currentSong && <source src={currentSong.audio} type="audio/mpeg"></source>}</audio>
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu setView={setView} view={view} onOpenEditProfile={()=> setOpenEditProfile(true)} />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea 
          view={view} 
          currentIndex={currentIndex} 
          onSelectSong={handleSelectSong} 
          onSelectFavourite={handlePlayFavourite}
          onSelectTag={loadPlaylist}
          songsToDisplay={songsToDisplay}
          setSearchSongs={setSearchSongs}
          />
        </div>
      </div>
      {/* Footer Player */}
      <Footer 
      playerState={playerState}
      playerControls={playerControls}
      playerFeatures={playerFeatures}
      />

      {openEditProfile && 
        <Modal onClose ={() => setOpenEditProfile(false)} >
        <EditProfile onClose={() => setOpenEditProfile(false)}></EditProfile>
        </Modal>}
    </div>
  );
};

export default Homepage;
