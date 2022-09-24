import {React, Component} from 'react';
import Message from './message';


class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolledToBottom: true,
        };
    }

    componentDidMount () {
        this.scrollToBottom(false);
    }

    componentDidUpdate () {
        if(this.state.scrolledToBottom) {
            this.scrollToBottom(false);
        }
    }

    scrollToBottom = (smooth, override) => {
        this.el.scrollIntoView(smooth ? { behavior: "smooth" } : {});
    }

    handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            this.setState({scrolledToBottom: true});
        } else {
            this.setState({scrolledToBottom: false});
        }
    }

    render () {
        return (
        <div className="messages" onScroll={this.handleScroll}>
            {this.props.roomState.messages.map(message => {
                this.msgCount++;
                console.log(this.msgCount.toString())
                let myMsg = false;
                if(message.sender === this.props.username) {
                    myMsg = true;
                }
                return(
                    <Message text = {message.message} key={this.msgCount.toString()} myMsg={myMsg} sender={message.sender}/>
                )
            })}
        <div ref={el => { this.el = el; }} />
        </div>)
    }
}

export default Messages;