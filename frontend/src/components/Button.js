import { Component } from 'react';
import '../css/button.scss';

class Button extends Component {
    render () {
        return (
            <button className={`btn btn-${this.props.type} ${this.props.extraClasses ? this.props.extraClasses.split(" ") : ""}`} onClick={() => this.props.onClick(this.props.arg)}>{this.props.text}</button>
        )
    }
}

export default Button;