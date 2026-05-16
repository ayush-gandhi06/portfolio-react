import React from 'react';
import "../styles/playerStats.css";

const PlayerStats = ({ stats }) => {
    return(
        <div id="playerStats">
            <h1>AYUSH GANDHI</h1>
            <div id="playerStats_lines">
                <span id="playerStats_lines_thick"></span>
                <span id="playerStats_lines_thin"></span>
            </div>
            <h2>Mechatronics Engineering Student @UW</h2>
        </div>
    )
}

export default PlayerStats;