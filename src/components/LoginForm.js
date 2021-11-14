import React, { useState, useContext, useRef } from 'react';
import { Button, Container, Col, Row, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { startLoadParent } from '../actions/ParentActions';
import { Redirect } from 'react-router-dom';

const LoginForm = (props) => {
    const [error, setError] = useState(``);
    const { signIn, currentUser } = useContext(AuthContext);
    const emailRef = useRef(``);
    const passwordRef = useRef(``);


    const login = async () => {
        setError(``);
        if(emailRef.current.value === ``) {
            return setError(`Please enter your email address`);
        }
        if(passwordRef.current.value === ``) {
            return setError(`Please enter your password.`);
        }
        try {
            const userCredential = await signIn(emailRef.current.value, passwordRef.current.value)
            Object.entries(props.currentParent).length === 0 ? props.startLoadParent(userCredential.user.uid) : null;
            props.history.push('/');
        }
        catch(error) {
            switch (error.code) {
                case 'auth/user-not-found': 
                    return setError(`Invalid username or email please try again.`)
                default:
                    return setError(error.code)
            }
        };
    } 
    
    if(currentUser) {
        Object.entries(props.currentParent).length === 0 ? props.startLoadParent(currentUser.uid) : null;
        return <Redirect to='/' />
    }

    return (
        <Container className="p-3 d-flex align-items-center" style={{width: "25%", height: "100vh"}} >
            <Card className="p-5">
                <Card.Title className='text-center mb-5'>
                    Inkindable
                </Card.Title>
                <Row>
                    <Row className='mb-3'>
                            <label className='mb-3 p-0' htmlFor='input'>Email</label>
                            <input className='p-2' id='email' type='email' name='email' ref={emailRef}></input>
                    </Row>
                    <Row className='mb-3'>
                        <label className='mb-3 p-0' htmlFor='input'>Username</label>
                        <input className='p-2' id='password' type='password' name='username' ref={passwordRef}></input>
                    </Row>
                    <Row>
                        { error && <Alert variant='danger'>{error}</Alert> }
                    </Row>
                    <Row  className="d-flex justify-content-center">
                        <Button className='mt-3 p-2' size='lg' variant='primary' onClick={login}>Login</Button>
                        <Button className='mt-3 p-2' size='lg' variant='secondary' onClick={() => props.history.push(`/signup`)}>Sign Up</Button>
                    </Row>
                </Row>
            </Card>        
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

const mapDispatchToProps = (dispatch) => ({
    startLoadParent: (uid) => dispatch(startLoadParent(uid))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);