import React, { useState, useContext, useRef } from 'react';
import { Container, Col, Row, Button, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { startAddParent } from '../actions/ParentActions';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';

const SignUpForm = (props) => {
    const [error, setError] = useState(``);
    const [dob, setDOB] = useState(null);
    const { createAccount } = useContext(AuthContext);
    const emailRef = useRef(null);
    const fNameRef = useRef(null);
    const lNameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const signUp = () => {
        setError(``);
        if(!fNameRef.current.value || !lNameRef.current.value || 
           !emailRef.current.value || !passwordRef.current.value || 
           !confirmPasswordRef.current.value || dob === null) {
            setError('Please fill out all form fields before submitting.');
        }
        else if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            setError('Your passwords do not match. Please re-enter them and try again.')
        }
        else {
            createAccount(emailRef.current.value, passwordRef.current.value)
            .then(({ user }) => {
                props.startAddParent({
                    uid: user.uid,
                    email: emailRef.current.value,
                    fName: fNameRef.current.value,
                    lName: lNameRef.current.value,
                    dob: dob.valueOf(),
                });
                props.history.push('/');
            })
            .catch(error => {
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        return setError(`This email is already in use. Please login or reset your password.`);
                    case 'auth/invalid-email':
                        return setError(`Invalid email address: Please enter a valid email address.`)
                    case 'auth/weak-password':
                        return setError(`Weak password: password must be at least 6 characters.`)
                    default: 
                        return setError(`${error.code} Error: ${error.message}`);
                }
            });
        }
    }

    return (
        <Container className="p-3 d-flex flex-column justify-content-center" style={{width: "40%", height: "100vh"}}>
            <Card className='p-5'>
                <Card.Title className='text-center mb-5 display-4'>Create Account</Card.Title>
                <Row className='mb-3'>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='input'>First Name</label>
                        <input className='p-2 mb-5' id='first-name' type='text' name='first-name' ref={fNameRef}></input>
                    </Col>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='input'>Last Name</label>
                        <input className='p-2 mb-5' id='last-name' type='text' name='last-name' ref={lNameRef}></input>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex flex-column'>
                        <label className= 'mb-3' htmlFor='input'>Email</label>
                        <input className='p-2 mb-5' id='email' type='email' name='email' ref={emailRef}></input>
                    </Col>
                    <Col className='d-flex flex-column'>
                        <label className= 'mb-3' htmlFor='input'>Date of Birth</label>
                        <DatePicker
                            value={dob}
                            onChange={(newValue) => setDOB(moment(newValue))}
                            renderInput={(params) => <TextField {...params}/>}
                            className='mb-3'
                        />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex flex-column'>
                        <label className= 'mb-3' htmlFor='password'>Password</label>
                        <input className='p-2 mb-3' id='password' type='password' name='password' ref={passwordRef}></input>
                    </Col>
                    <Col className='d-flex flex-column'>    
                        <label className= 'mb-3' htmlFor='password'>Confirm Password</label>
                        <input className='p-2 mb-3' id='con-password' type='password' name='con-password' ref={confirmPasswordRef}></input>
                    </Col>
                </Row>
                <Row>
                    <Col className='mt-5'>
                        { error && <Alert variant='danger'>{error}</Alert> }
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center'>
                    <Button
                        variant='primary' 
                        size='lg'
                        onClick={signUp}
                        className='mb-3'
                    >Sign Up</Button>
                    <Button 
                        size='lg'
                        variant='secondary' 
                        onClick={() => props.history.push('/')}
                    >Return to Login</Button>
                </Row>
            </Card>
        </Container>
    )
}

const mapDispatchToProps = (dispatch) => ({
    startAddParent: (parent) => dispatch(startAddParent(parent)),
})

export default connect(undefined, mapDispatchToProps)(SignUpForm)