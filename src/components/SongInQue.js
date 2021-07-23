import React, {useState} from 'react';
import "./styles/SongInQue.css";


const SongInQue = ({songs}) => {
    return (
        <>
            {songs.map((song) => (
                <p key = {song.id}> {song.title} {song.artist} </p>
            ))}     
        </>
    )
}

SongInQue.defaultProps = {
    name: "TestName",
    artist: "Test Artist",
}

export default SongInQue;
