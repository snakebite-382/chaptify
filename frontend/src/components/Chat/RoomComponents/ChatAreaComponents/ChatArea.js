import {React, Component, createRef} from 'react';
import { Formik, Field, Form} from 'formik';
import { withAuth0 } from '@auth0/auth0-react';
import MessageInput from './MessageInput';
import Messages from './Messages';
import SendIcon from '../../../../img/icons/send.svg';
import "../../../../css/Chat/chat-area.scss";


class ChatArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputHeight: 0,
            inputRef: null,
        };
        this.chatWindow = createRef();
    }
    componentDidMount () {
        // socket.io initialization
        let { user } = this.props.auth0;
        this.user = user;

        this.props.io.on("NEW MESSAGE", data => {
            this.props.recvMessage(data.message);
        })

        this.renderInitMessages();
    }

    sendMessage = message => {
        //console.log(this.props.roomState)
        this.props.io.emit("SEND MESSAGE", {user: this.user, message: message, channel: this.props.roomState.renderChannel})
    }


    renderInitMessages = () => {
        let messages = this.props.roomState;

    }

    updateInputHeight = height => {
        this.setState({inputHeight: height});
    }

    setInputRef = ref => {
        this.setState({inputRef: ref})
    }

    msgCount = 0

    render() {
        if(this.props.roomState.loading) {
            return (
            <div className="chat-area">
                <h1>Loading...</h1>
            </div>)
        }

        return (
            <div className="chat-area">
                <Messages ref={this.chatWindow}roomState={this.props.roomState} username={this.props.username} inputHeight={this.state.inputHeight}/>
                <div className="input-area">
                    <div className="input-bar">

                        <Formik
                            initialValues={{
                                message: ""
                            }}

                            onSubmit={async (values, {resetForm}) => {
                                if(this.state.inputRef.value.length > 0) {
                                    this.sendMessage(this.state.inputRef.value)
                                    resetForm()
                                    this.state.inputRef.value = '';
                                }
                            }}
                        >
                            <Form>
                                <Field
                                    updateHeight = {this.updateInputHeight}
                                    setRef = {this.setInputRef}
                                    component={MessageInput}
                                    autoComplete="off"
                                    type="text"
                                    id="message"
                                    name="message"
                                />

                                <button type='submit' className="send btn"><div className="hover-area"></div><img src={SendIcon} alt=""/> </button>
                            </Form>
                        </Formik>

                    </div>
                </div>
            </div>
        )
    }
}

export default withAuth0(ChatArea);