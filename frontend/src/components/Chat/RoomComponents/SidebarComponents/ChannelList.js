import { React, Component } from "react";
import { withAuth0 } from '@auth0/auth0-react';
import Lock from '../../../../img/icons/lock.svg'

class ChannelList extends Component {
    render() {
        return (
            <div className="channels">
                <h2>Channels</h2>
                <ul className="list">
                    {this.props.channels.map((channel, index) => {
                        let allowed = false;
                        if(channel.allowedRoles.indexOf("*") === -1 && channel.allowedUsers.indexOf("*") === -1) { // some users aren't allowed
                            let {user} = this.props.auth0;

                            if(channel.allowedUsers.indexOf(user.user_id) !== -1) {
                                allowed = true;
                            }

                            if(!allowed) {
                                user.roles.forEach(role => {
                                    if(channel.allowedRoles.indexOf(role) !== -1) {
                                        allowed = true;
                                    }
                                })
                            }
                        } else {
                            allowed = true;
                        }

                        return(<li className={`channel ${allowed ? 'allowed' : 'blocked'}`} key={index}><h3>#{channel.name}<img src={Lock} alt=""/></h3></li>)
                    })}
                </ul>
            </div>
        )
    }
}

export default withAuth0(ChannelList);