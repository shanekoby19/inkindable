import React, { useState, useRef, useEffect } from 'react';
import { Container, Alert, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { connect } from 'react-redux';
import moment from 'moment';

import db from '../firebase/firebase'
import { collection, query, where } from '@firebase/firestore';
import { getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { updateParent } from '../actions/ParentActions';

const EditChildForm = (props) => {
    const [error, setError] = useState(``);
    const [showModal, setShowModal] = useState(false);
    const [delegateData, setDelegateData] = useState([]);
    const [centerData, setCenterData] = useState([]);
    const [classroomData, setClassroomData] = useState([]);
    const [selectedDelegate, setSelectedDelegate] = useState(``);
    const [selectedCenter, setSelectedCenter] = useState(``);
    const [selectedClassroom, setSelectedClassroom] = useState(``);
    const [dob, setDOB] = useState(props.childData.dob || moment());
    const fNameRef = useRef(props.childData.fName || ``);
    const lNameRef = useRef(props.childData.lName || ``);
    
    useEffect(async () => {
        const allDelegateData = [``];
        const allDelegates = await getDocs(query(collection(db, 'delegates')));
        const currentDelegateDoc = await getDocs(query(collection(db, 'delegates'), where('name', '==', props.childData.delegate)));
        const currentDelegateId = currentDelegateDoc.docs[0].id;
        allDelegates.forEach(delegate => allDelegateData.push(delegate.data().name));
        allDelegateData.sort();
        setDelegateData(allDelegateData);

        const allCenterData = [``];
        const allCenters = await getDocs(query(collection(db, `delegates/${currentDelegateId}/centers`)));
        const currentCenterDoc = await getDocs(query(collection(db, `delegates/${currentDelegateId}/centers`), where('name', '==', props.childData.center)));
        const currentCenterId = currentCenterDoc.docs[0].id;
        allCenters.forEach(center => allCenterData.push(center.data().name));
        allCenterData.sort();
        setCenterData(allCenterData);

        const allClassroomData = [``];
        const allClassrooms = await getDocs(query(collection(db, `delegates/${currentDelegateId}/centers/${currentCenterId}/classrooms`)));
        allClassrooms.forEach(classroom => allClassroomData.push(classroom.data().name));
        allClassroomData.sort();
        setClassroomData(allClassroomData);

        document.getElementById(`delegate-select`).value = props.childData.delegate;
        document.getElementById(`center-select`).value = props.childData.center;
        document.getElementById(`classroom-select`).value = props.childData.classroom;

        setSelectedDelegate(props.childData.delegate);
        setSelectedCenter(props.childData.center);
        setSelectedClassroom(props.childData.classroom);

    }, []);

    const loadCenters = async (delegate) => {
        const delegates = await getDocs(query(collection(db, 'delegates'), where('name', '==', delegate)))
        const delegateId = delegates.docs[0].id;

        const tempCenters = [``];
        const centers = await getDocs(query(collection(db, `delegates/${delegateId}/centers`)))
        centers.forEach(center => tempCenters.push(center.data().name));
        tempCenters.sort();
        setCenterData(tempCenters);
    }

    const loadClassrooms = async (selectedDelegate, center) => {
        const delegates = await getDocs(query(collection(db, 'delegates'), where('name', '==', selectedDelegate)))
        const delegateId = delegates.docs[0].id;

        const centers = await getDocs(query(collection(db, `delegates/${delegateId}/centers`), where('name', '==', center)))
        const centerId = centers.docs[0].id;

        const tempClassrooms = [``];
        const classrooms = await getDocs(query(collection(db, `delegates/${delegateId}/centers/${centerId}/classrooms`)))
        classrooms.forEach(classroom => tempClassrooms.push(classroom.data().name));
        tempClassrooms.sort();
        setClassroomData(tempClassrooms);
    }

    const isValidChildInfo = (confirmedDOB=false) => {
        setError(``);
        if(fNameRef.current.value === `` || lNameRef.current.value === `` ||
           selectedDelegate === `` || selectedCenter === `` || selectedClassroom === ``) {
            setError(`All fields are required. Please complete the form before saving.`);
            return false
        }
        if(!confirmedDOB && dob.isSame(moment(new Date()), 'day')) {
            setShowModal(true);
            return false;
        }

        return true;
    }

    const saveChild = async (confirmedDOB=false) => {

        if(!isValidChildInfo(confirmedDOB)) {
            return undefined
        }

        // Send child to the database.
        const q = query(collection(db, `parents/${props.currentParent.refId}/children`), where('fName', '==', props.childData.fName));
        const childDocs = await getDocs(q);
        let childRefId = childDocs.docs[0].id;
        const childDoc = doc(collection(db, `parents/${props.currentParent.refId}/children`), childRefId);
        await updateDoc(childDoc, {
            fName: fNameRef.current.value,
            lName: lNameRef.current.value,
            dob: dob.valueOf(),
            delegate: selectedDelegate,
            center: selectedCenter,
            classroom: selectedClassroom,
        });
        const parentDoc = doc(collection(db, `parents`), props.currentParent.refId);
        const document = await getDoc(parentDoc);
        props.updateParent({
            ...document.data(),
            refId: props.currentParent.refId,
        });
        props.history.push('/logs');
        props.history.push('/account');
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
    const handleClassroomChange = (e) => {
        setSelectedClassroom(e.target.value);
    }

    const handleCancelEdit = () => {
        props.setShowEditChildForm(false);
        props.setShowEditChildList(true);
    }

    return (
        <Container className='my-lg-0 my-md-5 my-sm-5 my-xs-5'>
            <Row className='border-bottom border-3 mb-5'>
                <h2 className='text-center display-4'>{props.currentParent.children.length <= 1 ? `Edit Child` : `Edit Children`}</h2>
            </Row>
       
            <Row className='justify-content-center'>
                <Col lg={10} xs={12} className='d-flex flex-column'>
                    <label className='mb-3' htmlFor='input'>First Name</label>
                    <input className='p-2 mb-3' id='first-name' type='text' name='first-name' ref={fNameRef} defaultValue={props.childData.fName || ``} ></input>
                </Col>
                <Col lg={10} xs={12} className='d-flex flex-column'>
                    <label className='mb-3' htmlFor='input'>Last Name</label>
                    <input className='p-2 mb-3' id='last-name' type='text' name='last-name' ref={lNameRef} defaultValue={props.childData.lName || ``} ></input>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col lg={10} xs={12} className='d-flex flex-column'> 
                    <label className='mb-3' htmlFor='input'>Date of Birth</label>
                    <DatePicker
                        value={dob}
                        onChange={(newValue) => setDOB(moment(newValue))}
                        renderInput={(params) => <TextField {...params}/>}
                    />
                </Col>
                <Col lg={10} xs={12}>
                    <label className='my-3' htmlFor='input'>Delegate</label>
                    <Form.Select onChange={handleDelegateChange} id='delegate-select' className='p-2 mb-3'>
                        { delegateData.map((name, index) => <option key={index} value={name}>{name}</option>) }
                    </Form.Select>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col lg={10} xs={12}>
                    <label className='mb-3' htmlFor='input'>Center</label>
                    <Form.Select onChange={handleCenterChange} id='center-select'  className='p-2 mb-3'>
                        { centerData.length !== 0 && centerData.map((name, index) => <option key={index} value={name}>{name}</option>) };
                    </Form.Select>
                </Col>

                <Col lg={10} xs={12} >
                    <label className='mb-3' htmlFor='input'>Classroom</label>
                    <Form.Select onChange={handleClassroomChange} id='classroom-select' className='p-2 mb-3' defaultValue={props.childData.classroom || ``}>
                        { classroomData.length !== 0 && classroomData.map((name, index) => <option key={index} value={name}>{name}</option>) };
                    </Form.Select>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col lg={10} xs={12} className='d-flex flex-column'>
                    { error && <Alert variant='danger'>{ error }</Alert> }
                </Col>
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
                <Col lg={10} xs={12} className='d-flex flex-column'>
                    <Button
                        variant='success'
                        onClick={() => saveChild()}
                        className='p-3 mb-3'
                    >Save Changes</Button>
                </Col>
                <Col lg={10} xs={12} className='d-flex flex-column'>
                    <Button
                        variant='danger'
                        onClick={handleCancelEdit}
                        className='p-3 mb-3'
                    >Cancel Changes</Button>
                </Col>
            </Row>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent
})

const mapDispatchToProps = (dispatch) => ({
    updateParent: (parent) => dispatch(updateParent(parent)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditChildForm)