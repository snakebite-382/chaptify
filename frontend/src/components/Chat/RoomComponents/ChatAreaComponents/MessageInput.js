import { contentSecurityPolicy } from 'helmet';
import {React, Component, } from 'react';
import { withResizeDetector } from "react-resize-detector";

class MessageInput extends Component {
    scaleMessageWindow = this.props.scaleMessageWindow;

    lastHeight=0;

    componentDidMount() {
        // store init height (this will always be the min height neat little trick to get the minimum computed inner heigh of that 4rem)
        let computedStyle = getComputedStyle(this.input);
        let height = this.input.clientHeight - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom));
        this.lastHeight = height;
        this.props.updateHeight(height);
        this.props.setRef(this.input);
    }

    handleChange = (e) => {
        // on input
        // auto scales height
        let limit = 192
        e.target.style.height = '4rem';
        e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`

        // if the height is different
        if(this.props.height !== this.lastHeight) {
            let computedStyle = getComputedStyle(this.input);
            let height = this.input.clientHeight - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom));
            this.lastHeight = height;
            this.props.updateHeight(height)
        }
    }


    componentDidUpdate = (prevProps) => {
        const width = this.props.width;

        if (width !== prevProps.width) {
            //run whenever width changes
        }
    }

    render () {
        let width = this.props.width; // width in pixels
        return (
            <textarea
                onChange={this.handleChange}
                className="message-input"
                placeholder={["Your Message Goes Here...", "Type Your Message Here...", "Message...", "Type Here..."][Math.floor((Math.random() * 3))]}
                ref={el => {this.input = el}}
                {...this.field}
            ></textarea>
        )
    }
}

export default withResizeDetector(MessageInput);