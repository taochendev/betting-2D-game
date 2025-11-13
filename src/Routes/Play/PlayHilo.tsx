import '../../Assets/CSS/Editor.scss'
import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import {toRuneScapeFormatFromExact} from "../../Utility/utils";
import Hilo from "../../Games/Hilo/Hilo";
import {faVolumeHigh, faVolumeMute} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export const PlayHilo: React.FC<any> = ({

}) => {

    const params = useParams();
    const [openLinkGuide, setOpenLinkGuide] = useState(false);
    const [muted, setMuted] = useState(localStorage.getItem('mute-sounds') == "true");

    useEffect(() => {
        if (!muted) {
            localStorage.removeItem('mute-sounds');
        } else {
            localStorage.setItem('mute-sounds', "true");
        }
    }, [muted])

    const getCurrentView = () => {
        return (<div className="Current-Tier-Container">
            {getAccountsView()}
        </div>)
    }

    function getAccountsView() {
        return <div className="OSRSAccount OSRSAccountGames">
        <div className="OSRSAccountSection OSRSAccountSectionGames">
                    <div className="OSRSAccountSectionExpandedHeader">
                        <div className="Heading">
                            <img src="/rocket.svg"/>
                            <h3>Hilo</h3>
                            <a onClick={() => setMuted(!muted)}><FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeHigh} /></a>
                            <a>|</a>
                            <span>{toRuneScapeFormatFromExact(0)} GP</span>
                        </div>
                        <div className="OSRSAccountsBar OSRSAccountsBarExpanded">
                            <select defaultValue={1}>
                             <option value={1}>Default</option>
                            </select>
                        </div>
                    </div>

                    <Hilo
                        balance={100000}
                        setBalance={() => {}}
                        username={'Default'}
                        currency={'OSRS'}
                        warn={false}
                    />

                </div>
        </div>
    }
    return (<>
        <div className="App-contents">
            <div className="Landing-conten ProfileView">
                <div className="CurrentView">
                    {getCurrentView()}
                </div>
                <br/><br/><br/><br/><br/><br/>
            </div>
        </div>

    </>)
}
