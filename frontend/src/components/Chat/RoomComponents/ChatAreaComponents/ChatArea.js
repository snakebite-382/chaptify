import {React, Component} from 'react';
import SendIcon from '../../../../img/icons/send.svg';
import "../../../../css/Chat/chat-area.scss";


class ChatArea extends Component {
    render() {
        if(this.props.roomState.loading) {
            return (
            <div className="chat-area">
                <h1>Loading...</h1>
            </div>)
        }

        return (
            <div className="chat-area">
                <div className="messages"></div>
                <div className="input-area">
                    <div className="input-bar">
                        <input type="text" className="message" />
                        <button className="send"><img src={SendIcon} alt=""/></button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatArea;