import React, { useState, useContext, useRef } from 'react';
import { Button, Container, Col, Row, Alert, Image } from 'react-bootstrap';
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
        <Container className="p-3">
            <Row className='mb-3 align-items-center' style={{height: '100vh'}}>
                <Col>
                    <Row className='d-flex flex-column align-items-center text-center mb-3'>
                        <Col lg={4} md={6} sm={12} xs={12} className='d-flex flex-column'>
                            <p><Image src="img/shineIcon.png" alt="Acelero Shine Icon" roundedCircle fluid /></p>
                        </Col>
                        <Col lg={4} md={6} sm={12} xs={12} className='d-flex flex-column'>
                            <h3>Inkindable</h3>
                        </Col>
                    </Row>
                    <Row className='d-flex flex-column align-items-center'>
                        <Col lg={4} md={6} sm={12} xs={12} className='d-flex flex-column mb-3'>
                            <label className='mb-3 p-0' htmlFor='input'>Email</label>
                            <input className='p-2' id='email' type='email' name='email' ref={emailRef}></input>
                        </Col>
                        <Col lg={4} md={6} sm={12} xs={12} className='col-12 d-flex flex-column'>
                            <label className='mb-3 p-0' htmlFor='input'>Username</label>
                            <input className='p-2' id='password' type='password' name='username' ref={passwordRef}></input>
                        </Col>
                    </Row>
                    <Row className='d-flex flex-column align-items-center'>
                        <Col lg={4} md={6} sm={12} xs={12} className='d-flex flex-column'>
                            { error && <Alert className='mt-3' variant='danger'>{error}</Alert> }
                        </Col>
                    </Row>
                    <Row className='d-flex flex-column align-items-center'>
                        <Col lg={4} md={6} sm={12} xs={12} className='d-flex flex-column'>
                            <Button className='mt-3 p-2' size='lg' variant='primary' onClick={login}>Login</Button>
                        </Col>
                        <Col lg={4} md={6} sm={12} xs={12} className='d-flex flex-column'>
                            <Button className='mt-3 p-2' size='lg' variant='secondary' onClick={() => props.history.push(`/signup`)}>Sign Up</Button>
                        </Col>
                    </Row>   
                </Col>
            </Row>   
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