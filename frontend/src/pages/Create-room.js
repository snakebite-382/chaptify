import { React, Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Formik, Field, Form} from 'formik';
import Button from '../components/Button';

class CreateRoom extends Component{
    render() {
        return (
            <>
                <h1>Create a new room</h1>
                <Formik
                    initialValues = {{
                        name: "",
                        public: true,
                        inviteOnly: false,
                        password: ""
                    }}

                    onSubmit={async values => {
                        let { user, getAccessTokenSilently} = this.props.auth0;
                        let token = await getAccessTokenSilently();
                        values.user = user;

                        console.table(values.user);

                        await axios.post(
                            process.env.REACT_APP_SERVER_URL + '/api/rooms/create',
                            values,
                            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
                        )
                        this.props.history.push('/')
                    }}
                >
                    <Form>
                        <label htmlFor="name">Room name: </label>
                        <Field id="name" name="name"/> <br/>

                        <label htmlFor="public">Public: </label>
                        <Field id="public" name="public" type="checkbox"/><br/>

                        <label htmlFor="inviteOnly">Invite Only: </label>
                        <Field id="inviteOnly" name="inviteOnly" type="checkbox"/> <br/>

                        <label htmlFor="password">Password: </label>
                        <Field id="password" name="password" type="password"/><br/>
                        <Button type="primary" text="Submit" onClick={() => {}}/>
                    </Form>
                </Formik>
            </>
        );
    }
}

export default withAuth0(CreateRoom);