import {React, Component, createRef} from 'react';
import Message from './message';


class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolledToBottom: true,
        };
        this.messageWindow = createRef();
    }

    height = 0;

    componentDidMount () {
        let computedStyle = getComputedStyle(this.messageWindow.current);
        let height = this.messageWindow.current.clientHeight - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom));
        this.height = height;

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

    resizeWindow(height) {
        this.messageWindow.current.style.height = height.toString() + "px";
        this.height = height;
    }


    document
    render () {
        let msgCount = 0
        return (
            <div
                ref={this.messageWindow}
                className="messages"
                onScroll={this.handleScroll}
                style={{height: `calc(100% - ${this.props.inputHeight}px)`}}
            >
                {this.props.roomState.messages.map(message => {
                    msgCount++;
                    let myMsg = false;
                    if(message.sender === this.props.username) {
                        myMsg = true;
                    }
                    return(
                        <Message text = {message.message} key={msgCount - 1} myMsg={myMsg} sender={message.sender}/>
                    )
                })}
                <div ref={el => { this.el = el; }} />
                {/* this is using the ref attribute to pass the element itself into a self calling function which defines a variable on the component called el which we can refer to as this.el to scroll to the bottom of the messages */}
            </div>
        )
    }
}

export default Messages;