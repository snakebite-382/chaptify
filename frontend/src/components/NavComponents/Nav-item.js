import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/nav.scss';

class NavItem extends Component {
    render() {
        return (
            <li className = "nav-item">
                <NavLink exact to={ this.props.path } className="nav-link" activeClassName="active"> { this.props.page }</NavLink>
            </li>
        )
    }
}

export default NavItem