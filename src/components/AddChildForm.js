import React, { useState, useContext, useRef, useEffect } from 'react';
import { Container, Alert, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { connect } from 'react-redux';
import moment from 'moment';

import db from '../firebase/firebase'
import { collection, query, where } from '@firebase/firestore';
import { addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { updateParent } from '../actions/ParentActions';

const AddChildForm = (props) => {
    const [error, setError] = useState(``);
    const [showModal, setShowModal] = useState(false);
    const [delegateData, setDelegateData] = useState([]);
    const [centerData, setCenterData] = useState([]);
    const [classroomData, setClassroomData] = useState([]);
    const [selectedDelegate, setSelectedDelegate] = useState(``);
    const [selectedCenter, setSelectedCenter] = useState(``);
    const [selectedClassroom, setSelectedClassroom] = useState(``);
    const [dob, setDOB] = useState(moment());
    const fNameRef = useRef(``);
    const lNameRef = useRef(``);
    
    useEffect(async () => {
        const tempDelegateData = [``];
        const delegates = await getDocs(query(collection(db, 'delegates')));
        delegates.forEach(delegate => tempDelegateData.push(delegate.data().name));
        tempDelegateData.sort();

        setDelegateData(tempDelegateData);
    }, [])

    const loadCenters = async (delegate) => {
        const delegates = await getDocs(query(collection(db, 'delegates'), where('name', '==', delegate)))
        const delegateId = delegates.docs[0].id;
        
        const tempCenters = [``];
        const centers = await getDocs(query(collection(db, `delegates/${delegateId}/centers`)))
        centers.forEach(center => tempCenters.push(center.data().name));
        tempCenters.sort();
        setCenterData(tempCenters);
    }

    const loadClassrooms = async (delegate, center) => {
        const delegates = await getDocs(query(collection(db, 'delegates'), where('name', '==', delegate)));
        const delegateId = delegates.docs[0].id;
        
        
        const centers = await getDocs(query(collection(db, `delegates/${delegateId}/centers`), where('name', '==', center)));
        const centerId = centers.docs[0].id;
        
        const tempClassrooms = [``];
        const classrooms = await getDocs(query(collection(db, `delegates/${delegateId}/centers/${centerId}/classrooms`)));
        classrooms.forEach(classroom => tempClassrooms.push(classroom.data().name));
        tempClassrooms.sort();
        setClassroomData(tempClassrooms);
    }
    
    const handleDelegateChange = (e) => {
        setSelectedDelegate(e.target.value); 
        setClassroomData([]);
        setCenterData([]);
        loadCenters(e.target.value); 
    }
    
    const handleCenterChange = (e) => {
        setSelectedCenter(e.target.value);
        setClassroomData([]);
        loadClassrooms(selectedDelegate, e.target.value);
    }

    const saveChild = async (confirmedDOB=false) => {
        setError(``);
        if(fNameRef.current.value === `` || lNameRef.current.value === `` ||
           selectedDelegate === `` || selectedCenter === `` || selectedClassroom === ``) {
            return setError(`All fields are required. Please complete the form before saving.`)
        }
        if(!confirmedDOB && dob.isSame(moment(new Date()), 'day')) {
            return setShowModal(true);
        }

        // Send child to the database.
        const childDoc = await addDoc(collection(db, `parents/${props.currentParent.refId}/children`), {
            fName: fNameRef.current.value,
            lName: lNameRef.current.value,
            dob: dob.valueOf(),
            delegate: selectedDelegate,
            center: selectedCenter,
            classroom: selectedClassroom,
        })
        const parentDoc = doc(db, `parents/${props.currentParent.refId}`);
        await updateDoc(parentDoc, {
            children: [childDoc.id, ...props.currentParent.children],
        });
        const currentParent = await getDoc(parentDoc)
        props.updateParent({
            ...currentParent.data(),
            refId: props.currentParent.refId,
        });
        props.history.push('/');
        props.history.push('/account');
    }

    return (
        <Container>
            <Row className='border-bottom border-3 mb-5'>
                <h2 className='text-center display-4'>Add Child</h2>
            </Row>
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
                    <Col className='d-flex flex-column'> 
                        <label className='mb-3' className= 'mb-3' htmlFor='input'>Date of Birth</label>
                        <DatePicker
                            value={dob}
                            onChange={(newValue) => setDOB(moment(newValue))}
                            renderInput={(params) => <TextField {...params}/>}
                            className='mb-5'
                        />
                    </Col>

                    <Col className='col-md-6'>
                        <label className='mb-3' htmlFor='input'>Delegate</label>
                        <Form.Select onChange={ handleDelegateChange } className='p-2 mb-5'>
                            { delegateData.map((name, index) => <option key={index} value={name}>{name}</option>) }
                        </Form.Select>
                    </Col>
                </Row>
                <Row>
                    <Col className='col-md-6'>
                        <label className='mb-3' htmlFor='input'>Center</label>
                        <Form.Select onChange={handleCenterChange} className='p-2 mb-5'>
                            { centerData.length !== 0 && centerData.map((name, index) => <option key={index} value={name}>{name}</option>) };
                        </Form.Select>
                    </Col>

                    <Col className='col-md-6'>
                        <label className='mb-3' htmlFor='input'>Classroom</label>
                        <Form.Select onChange={(e) => setSelectedClassroom(e.target.value)}className='p-2 mb-5'>
                        { classroomData.length !== 0 && classroomData.map((name, index) => <option key={index} value={name}>{name}</option>) };
                        </Form.Select>
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
                    <Button
                        variant='danger'
                        onClick={() => {
                            props.setShowAddChildAlert(props.currentParent.children.length === 0);
                            props.setShowEditChildList(props.currentParent.children.length !== 0);
                            props.setShowAddChildForm(false);
                        }}
                        className='p-3 mb-3'
                    >Cancel</Button>
                </Row>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent
})

const mapDispatchToProps = (dispatch) => ({
    updateParent: (parent) => dispatch(updateParent(parent))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddChildForm);