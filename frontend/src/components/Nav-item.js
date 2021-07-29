import { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/nav.css';

class NavItem extends Component {
    render() {
        return (
            <li className = "nav-item">
                <Link to ={ this.props.path } className={this.props.ID === this.props.activeID ? "nav-link active" : "nav-link"} onClick={() => {this.props.onClick(this.props.ID)}}> { this.props.page }</Link>
            </li>
        )
    }
}

export default NavItem