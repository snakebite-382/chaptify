import { React, Component } from 'react'

class Message extends Component {
    render() {
        return(
            <div className={"message-container " + (this.props.myMsg ? "myMsg" : "")}>
                <div className='sender-container'>
                    <span className="sender">{this.props.sender}</span>
                </div>
                <div className={"message"}>{this.props.text}</div>
            </div>
        )
    }
}

export default Message;