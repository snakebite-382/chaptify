import {React, Component} from 'react';
import '../../../css/Chat/settingsContainer.scss'

class SettingsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: "user",
        }
    }

    render () {
        return (
            <div className="settingsView">
                <div className='tabs'>
                    <span className="selection selectUserSettings selected">User Settings</span>
                    <span className="selection selectRoomSettings">Room Settings</span>
                </div>
                <div className="settings"></div>
            </div>
        )
    }
}

export default SettingsContainer;