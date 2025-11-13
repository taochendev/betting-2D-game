import React from 'react';
import './Assets/CSS/App.scss';
import './Assets/CSS/Leaderboard.scss';
import './Assets/CSS/Challenges.scss';
import './Assets/CSS/Challenges.responsive.scss';
import './Assets/CSS/featuredInfo.scss';
import './Assets/CSS/Giveaways.scss';
import './Assets/CSS/Giveaways.responsive.scss';
import './Assets/CSS/App.responsive.scss';
import './Assets/CSS/Profile.scss';
import './Games/Game.scss';
import {PlayerDetails} from "./API/api";
import {PlayHilo} from "./Routes/Play/PlayHilo";

export default function App() {
    const [details, setDetails] = React.useState<PlayerDetails | undefined>(undefined)

    return (
        <div className="App">
            <div className="App-contents-container"
                 key={details?.currentProfile ?? 'loggedout'}
            >
            <PlayHilo />
            </div>
        </div>
    );


}

