import React, { useState, useContext, useRef } from 'react';
import moment from 'moment';
import { Button, Alert, Modal, Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { connect } from 'react-redux';
import { startDeleteParent, startUpdateParent } from '../actions/ParentActions';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';

const AccountForm = (props) => {
    const [error, setError] = useState(``);
    const [passwordSuccess, setPasswordSuccess] = useState(``);
    const [emailSuccess, setEmailSuccess] = useState(``);
    const [accountSuccess, setAccountSuccess] = useState(``);
    const [reauthenticateError, setReauthenticateError] = useState(``);
    const [dob, setDOB] = useState(moment(props.currentParent.dob));
    const [showAlert, setShowAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { deleteUserAccount, currentUser, updateUserEmail, updateUserPassword, reauthenticate } = useContext(AuthContext);
    const emailRef = useRef(null);
    const fNameRef = useRef(null);
    const lNameRef = useRef(null);
    const passwordRef = useRef(``);
    const confirmPasswordRef = useRef(``);
    const authPasswordRef = useRef(``);

    const deleteParent = () => {
        setError(``);
        setAccountSuccess(``);
        const uid = currentUser.uid;
        deleteUserAccount();
        props.history.push('/login');
        props.startDeleteParent(props.currentParent.refId);
    }

    const updateParent = async () => {
        setError(``);
        setPasswordSuccess(``);
        setEmailSuccess(``);
        setAccountSuccess(``);
        if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            return setError(`Your passwords do not match. Please re-enter them and try again.`)
        }
        if(emailRef.current.value !== props.currentParent.email) {
            await updateUserEmail(emailRef.current.value, authPasswordRef.current.value)
            .then(() => {
                currentUser.getIdToken(currentUser, true);
                props.startUpdateParent(props.currentParent.refId, emailRef.current.value);
                setEmailSuccess(`Email updated successfully.`)
            })
            .catch(e => {
                switch(e.code) {
                    case 'auth/requires-recent-login':
                        return setShowModal(true);
                    case 'auth/email-already-in-use':
                        return setError(`This email is already in use. Please login or reset your password.`);
                    case 'auth/invalid-email':
                        return setError(`Invalid email address: Please enter a valid email address.`)
                    case 'auth/weak-password':
                        return setError(`Weak password: password must be at least 6 characters.`)
                    default:
                        return setError(e.code)
                }
            })
        }
        if(passwordRef.current.value === confirmPasswordRef.current.value && passwordRef.current.value !== ``) {
            updateUserPassword(passwordRef.current.value, authPasswordRef.current.value)
            .then(() => {
                currentUser.getIdToken(currentUser, true);
                setPasswordSuccess(`Password updated successfully`);
            })
            .catch(e => {
                switch(e.code) {
                    case 'auth/requires-recent-login':
                        return setShowModal(true);
                    case 'auth/email-already-in-use':
                        return setError(`This email is already in use. Please login or reset your password.`);
                    case 'auth/invalid-email':
                        return setError(`Invalid email address: Please enter a valid email address.`)
                    case 'auth/weak-password':
                        return setError(`Weak password: password must be at least 6 characters.`)
                    default:
                        return setError(e.code)
                }
            })
        }
        if(fNameRef.current.value !== props.currentParent.fName && fNameRef.current.value !== `` || 
           lNameRef.current.value !== props.currentParent.lName && lNameRef.current.value !== `` ||
           dob.valueOf() !== props.currentParent.dob) {
            props.startUpdateParent(props.currentParent.refId, undefined, fNameRef.current.value, lNameRef.current.value, dob.valueOf())
            setAccountSuccess(`Account updated successfully`);
        }
    }

    const reauthenticateAndUpdate = () => {
        setReauthenticateError(``);
        reauthenticate(authPasswordRef.current.value)
        .then(() => {
            updateParent();
            setShowModal(false);
        })
        .catch(e => {
            switch(e.code) {
                case 'auth/user-mismatch':
                    return setReauthenticateError(`Invalid password, please try again.`)
                case 'auth/wrong-password':
                    return setReauthenticateError(`Invalid password, please try again.`)
                default:
                    setReauthenticateError(e.code);
            }
        })
    }

    return (
        <div>
            <Container>
                <Row className='border-bottom border-3 mb-5'>
                    <h2 className='text-center display-4'>Account Details</h2>
                    <Col className='col-sm-4 col-lg-6'>
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Reauthentication required</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='d-flex flex-column'>
                                <label className='mb-3 h4' htmlFor='password'>Password</label>
                                <input className='p-2' id='last-name' type='password' name='password' ref={authPasswordRef}></input>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container fluid className='p-0'>
                                    { reauthenticateError && <Alert variant='danger'>{ reauthenticateError }</Alert>}
                                </Container>
                                <Container className='d-flex justify-content-end p-0'>
                                    <Button style={{marginRight: '1rem'}} variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={reauthenticateAndUpdate}>Update</Button>
                                </Container>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='input'>First Name</label>
                        <input className='p-2 mb-5' id='first-name' type='text' name='first-name' ref={fNameRef} defaultValue={props.currentParent.fName}></input>
                    </Col>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='input'>Last Name</label>
                        <input className='p-2 mb-5' id='last-name' type='text' name='last-name' ref={lNameRef} defaultValue={props.currentParent.lName}></input>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='input'>Email</label>
                        <input className='p-2 mb-5' id='email' type='email' name='email' ref={emailRef} defaultValue={props.currentParent.email}></input>
                    </Col>
                    <Col className='d-flex flex-column'> 
                        <label className='mb-3' className= 'mb-3' htmlFor='input'>Date of Birth</label>
                        <DatePicker
                            value={dob}
                            onChange={(newValue) => setDOB(moment(newValue))}
                            renderInput={(params) => <TextField {...params}/>}
                            sx={ {padding: 2} }
                        />
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='password'>Password</label>
                        <input className='p-2 mb-5' id='password' type='password' name='password' ref={passwordRef}></input>
                    </Col>
                    <Col className='d-flex flex-column'>
                        <label className='mb-3' htmlFor='password'>Confirm Password</label>
                        <input className='p-2 mb-5' id='con-password' type='password' name='con-password' ref={confirmPasswordRef}></input>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    {showAlert && 
                    <Alert 
                        variant='danger'
                        onClose={() => setShowAlert(false)}
                        dismissible
                    >
                        <Alert.Heading>Are you sure you want to delete your account?</Alert.Heading>
                        <p>
                            Doing so will remove all your personal data from the database. This cannot be undone.
                        </p>
                        <Button variant='danger' onClick={deleteParent}>Confirm Delete</Button>
                    </Alert>
                    }
                </Row>
                <Row className='mb-3 d-flex flex-column'>
                    { error && <Alert variant='danger'>{ error }</Alert> }
                    { passwordSuccess && <Alert variant='success'>{ passwordSuccess }</Alert> }
                    { emailSuccess && <Alert variant='success'>{ emailSuccess }</Alert> }
                    { accountSuccess && <Alert variant='success'>{ accountSuccess }</Alert> }
                    <Button
                        variant='success'
                        onClick={updateParent}
                        className='p-3 mb-3'
                    >Save Changes</Button> 
                    <Button 
                        variant='danger' 
                        onClick={() => setShowAlert(true)}
                        className='p-3'>
                    Delete Account</Button>
                </Row>
            </Container>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    startDeleteParent: (refId) => dispatch(startDeleteParent(refId)),
    startUpdateParent: (refId, email, fName, lName, dob) => dispatch(startUpdateParent(refId, email, fName, lName, dob)),
    deleteParent: (refId) => dispatch(deleteParent(refId))
});

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);