import React, { useState, useContext, useRef, useEffect } from 'react';
import { Container, Alert, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { connect } from 'react-redux';
import moment from 'moment';

import db from '../firebase/firebase'
import { collection, query, where } from '@firebase/firestore';
import { getDocs } from 'firebase/firestore';

const ChildForm = (props) => {
    const [hasChild, setHasChild] = useState(props.currentParent.children.length !== 0);
    const [error, setError] = useState(``);
    const [showModal, setShowModal] = useState(false);
    const [showAddChildForm, setShowAddChildForm] = useState(false);
    const [delegateData, setDelegateData] = useState([]);
    const [centerData, setCenterData] = useState([]);
    const [classroomData, setClassroomData] = useState([]);
    const [selectedDelegate, setSelectedDelegate] = useState(``);
    const [selectedClassroom, setSelectedClassroom] = useState(``);
    const [dob, setDOB] = useState(moment());
    const fNameRef = useRef(``);
    const lNameRef = useRef(``);
    
    useEffect( async () => {
        const tempDelegateData = [``];
        await getDocs(query(collection(db, 'delegates')))
        .then(snapshot => snapshot.forEach(delegate => tempDelegateData.push(delegate.data().name)))
        .catch(error => console.log(error));

        setDelegateData(tempDelegateData);
    }, [])

    const loadCenters = async (delegate) => {
        const tempCenters = [];
        await 
        getDocs(query(collection(db, 'delegates'), where('name', '==', delegate)))
            .then(snapshot => {
                const delegateId = snapshot.docs[0].id;
                getDocs(query(collection(db, `delegates/${delegateId}/centers`)))
                .then(snapshot => {
                    snapshot.forEach(center => tempCenters.push(center.data().name));
                    setCenterData(tempCenters);
                })
            });
    }

    const loadClassrooms = async (delegate, center) => {
        const tempClassrooms = [];
        await 
        getDocs(query(collection(db, 'delegates'), where('name', '==', delegate)))
            .then(snapshot => {
                const delegateId = snapshot.docs[0].id;
                getDocs(query(collection(db, `delegates/${delegateId}/centers`), where('name', '==', center)))
                .then(snapshot => {
                    const centerId = snapshot.docs[0].id;
                    getDocs(query(collection(db, `delegates/${delegateId}/centers/${centerId}/classrooms`)))
                    .then(snapshot => {
                        snapshot.forEach(classroom => tempClassrooms.push(classroom.data().name));
                        setClassroomData(tempClassrooms);
                    })
                })
            });
    }
    
    const handleDelegateChange = (e) => {
        setSelectedDelegate(e.target.value); 
        setClassroomData([]);
        loadCenters(e.target.value); 
    }

    const saveChild = (confirmedDOB=false) => {
        setError(``);
        if(fNameRef.current.value === `` || lNameRef.current.value === ``) {
            return setError(`All fields are required. Please complete the form before saving.`)
        }
        if(!confirmedDOB && dob.isSame(moment(new Date()), 'day')) {
            return setShowModal(true);
        }

        // Send child to the database.
    }

    return (
        <Container>
            <Row className='border-bottom border-3 mb-5'>
                <h2 className='text-center display-4'>Children</h2>
            </Row>

            {
                !hasChild &&
                <Row className='align-items-end'>
                    <Col>
                        <Alert variant='warning'>Uh-oh, it looks like we didn't find any children for your profile. Please add a child.</Alert>
                        <Button variant='primary' onClick={() => { setShowAddChildForm(true); setHasChild(true); } }>Add Child</Button>
                    </Col>
                </Row>
            }
            {
                showAddChildForm &&
                <div>
                    <Row className='align-items-end mb-3'>
                        <Col className='d-flex flex-column col-md-6'>
                            <label className='mb-3' htmlFor='input'>First Name</label>
                            <input className='p-2 mb-5' id='first-name' type='text' name='first-name' ref={fNameRef} ></input>
                        </Col>
                        <Col className='d-flex flex-column col-md-6'>
                            <label className='mb-3' htmlFor='input'>Last Name</label>
                            <input className='p-2 mb-5' id='last-name' type='text' name='last-name' ref={lNameRef} ></input>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='col-md-6'>
                            <label className='mb-3' htmlFor='input'>Delegate</label>
                            <Form.Select onChange={ handleDelegateChange } className='p-2 mb-5'>
                                { delegateData.map((name, index) => <option key={index} value={name}>{name}</option>) }
                            </Form.Select>
                        </Col>

                        <Col className='col-md-6'>
                            <label className='mb-3' htmlFor='input'>Center</label>
                            <Form.Select onChange={(e) => { loadClassrooms(selectedDelegate, e.target.value); }} className='p-2 mb-5'>
                                { centerData.length !== 0 && centerData.map((name, index) => <option key={index} value={name}>{name}</option>) };
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='col-md-6'>
                            <label className='mb-3' htmlFor='input'>Classroom</label>
                            <Form.Select className='p-2 mb-5'>
                            { classroomData.length !== 0 && classroomData.map((name, index) => <option key={index} value={name}>{name}</option>) };
                            </Form.Select>
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
                    <Row className='d-flex flex-column'>
                        { error && <Alert variant='danger'>{ error }</Alert> }
                        <Modal className='d-flex' show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header className='container' closeButton>
                                <Modal.Title>Confirm date of birth</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Alert variant='warning'>You've entered a dob for {fNameRef.current.value} of today ({dob.format('MMMM Do, YYYY')}). Please confirm this is correct before saving.</Alert>
                            </Modal.Body>
                            <Modal.Footer>
                                <Container className='d-flex justify-content-end p-0'>
                                    <Button style={{marginRight: '1rem'}} variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={() => { setShowModal(false); saveChild(true) } }>Update</Button>
                                </Container>
                            </Modal.Footer>
                        </Modal>
                        <Button
                            variant='success'
                            onClick={() => saveChild()}
                            className='p-3 mb-3'
                        >Save Changes</Button>
                    </Row>
                </div>
            }
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent
})

export default connect(mapStateToProps)(ChildForm)