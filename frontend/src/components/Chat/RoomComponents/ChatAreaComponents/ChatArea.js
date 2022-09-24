import {React, Component} from 'react';
import { Formik, Field, Form} from 'formik';
import { withAuth0 } from '@auth0/auth0-react';
import TextAreaAutoResize from 'react-textarea-autosize';
import Messages from './Messages';
import SendIcon from '../../../../img/icons/send.svg';
import "../../../../css/Chat/chat-area.scss";


class ChatArea extends Component {
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
        console.table(messages);

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
                <Messages roomState={this.props.roomState} username={this.props.username}/>
                <div className="input-area">
                    <div className="input-bar">

                        <Formik
                            initialValues={{
                                message: ""
                            }}

                            onSubmit={async (values, {resetForm}) => {
                                if(values.message.length > 0) {
                                    //console.log(values)
                                    this.sendMessage(values.message)
                                    resetForm()
                                }
                            }}
                        >
                            <Form>
                                <Field autoComplete="off" type="text" id="message"
                                component={TextAreaAutoResize}
                                name="message" className="message-input" placeholder={["Your Message Goes Here...", "Type Your Message Here...", "Message...", "Type Here..."][Math.floor((Math.random() * 3))]}/>

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