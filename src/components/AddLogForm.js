import { getDocs, collection, addDoc, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Container, Row, Button, Col, Form, ButtonGroup, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import moment from 'moment';

import db from '../firebase/firebase';

const AddLogForm = (props) => {
    const [error, setError] = useState(``)
    const [childData, setChildData] = useState([]);
    const [startDate, setStartDate] = useState(moment().day(0).startOf('day'));
    const [endDate, setEndDate] = useState(moment().day(0).add(6, 'days').startOf('day'));
    const [selectedChild, setSelectedChild] = useState(``);
    const [selectedLogType, setSelectedLogType] = useState(``);
    const [logTypes, setLogTypes] = useState([]);

    useEffect(async () => {
        const data = [{fName: ``, lName: ``}];
        const children = await getDocs(collection(db, `parents/${props.currentParent.refId}/children`));
        children.forEach(child => data.push({
            refId: child.id,
            ...child.data(),
        }));

        setLogTypes([``, `Peer Cards`, `Reading At Home`, `Volunteer Hours`].sort());
        setChildData(data);
        childData.sort((first, second) => first.fName > second.fName);
    }, []);

    const handleAddLog = async () => {
        if(!selectedChild) {
            return setError(`Please select a child to add this log to.`);
        }
        else if(!selectedLogType) {
            return setError(`Please select a log type.`);
        }

        const fName = selectedChild.split(' ')[0];
        const currentChild = childData.filter(child => child.fName === fName)[0];
        const logsCollection = collection(db, `parents/${props.currentParent.refId}/children/${currentChild.refId}/logs`);
        const q = query(logsCollection, where('type', '==', selectedLogType), where('date', '==', moment(startDate).valueOf()));
        const logs = await getDocs(q);

        if(logs.docs.length > 0) {
            return setError(`These logs already exist.`);
        }

        const days = [0, 1, 2, 3, 4, 5, 6];

        const dataLoad = days.map(day => ({
            type: selectedLogType,
            date: moment(startDate).add(day, 'days').startOf('day').valueOf(),
            minutes: 0,
            status: `Pending`,
            title: ``,
        }));

        await addDoc(logsCollection, {
            createdAt: moment().valueOf(),
            status: 'pending',
            logDays: dataLoad,
            totalTime: 0,
            type: selectedLogType,
            childName: `${currentChild.fName} ${currentChild.lName}`,
        });

        props.setShowAddLogForm(false);
        props.setShowLogList(true);

    }

    return (
        <Container>
                <Row className='border-bottom border-3 mb-5'>
                    <h2 className='text-center display-4'>Add New Log</h2>
                </Row>
                <Row>
                    <Col className='col-md-6'>
                        <label className='mb-3' htmlFor='input'>Child</label>
                        <Form.Select onChange={(e) => setSelectedChild(e.target.value)} id='child-select' className='p-2 mb-5'>
                            { childData.map((child, index) => <option key={index} value={`${child.fName} ${child.lName}`}>{`${child.fName} ${child.lName}`}</option>) }
                        </Form.Select>
                    </Col>
                    <Col className='col-md-6'>
                        <label className='mb-3' htmlFor='input'>Log Type</label>
                        <Form.Select onChange={(e) => setSelectedLogType(e.target.value)} id='log-select' className='p-2 mb-5'>
                            { logTypes.map((logType, index) => <option key={index} value={logType}>{logType}</option>) }
                        </Form.Select>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex flex-column col-md-6'> 
                        <label className='mb-3' className= 'mb-3' htmlFor='input'>Start Date</label>
                        <DatePicker
                            value={startDate}
                            onChange={(newValue => {
                                setStartDate(moment(newValue).startOf('day'));
                                setEndDate(moment(newValue).add(6, 'days').startOf('day'));
                            }) }
                            shouldDisableDate={(date) => moment(date).day() !== 0 || moment(date) > moment().startOf('day')}
                            renderInput={(params) => <TextField {...params}/>}
                            className='mb-5'
                        />
                    </Col>
                    <Col className='d-flex flex-column col-md-6'> 
                        <label className='mb-3' className= 'mb-3' htmlFor='input'>End Date</label>
                        <DatePicker
                            value={endDate}
                            onChange={(newValue => {
                                setEndDate(moment(newValue).startOf('day'));
                                setStartDate(moment(newValue).subtract(6, 'days').startOf('day'));
                            }) }
                            shouldDisableDate={(date) => moment(date).day() !== 6 || moment(date) > moment().startOf('day')}
                            renderInput={(params) => <TextField {...params}/>}
                            className='mb-5'
                        />
                    </Col>
                </Row>
                <Row className='mt-5'>
                    <Col>
                        { error && <Alert variant='danger'>{ error }</Alert> }
                        <ButtonGroup className='d-flex'>
                            <Button 
                                className='p-3' 
                                variant='success'
                                onClick={handleAddLog}
                                >Add Log</Button>
                        </ButtonGroup>
                        <ButtonGroup className='d-flex mt-2'>
                            <Button 
                                className='p-3' 
                                variant='danger'
                                onClick={() => {
                                    props.setShowAddLogForm(false);
                                    props.setShowLogList(true);
                                }}
                                >Cancel</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default connect()(AddLogForm);