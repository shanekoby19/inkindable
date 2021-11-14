import React, { useState } from 'react';
import { Button, Row, Col, Badge } from 'react-bootstrap';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import moment from 'moment';

import LogListItem from './LogListItem';
import db from '../firebase/firebase';

const LogListHeader = (props) => {
    const [showLogListHeader, setShowLogListHeader] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [reload, setReload] = useState(false);

    const handleSelectedLog = (selectedLog) => {  

        props.logData.forEach(log => {
            if(log.isShowing === undefined) {
                log.isShowing = false;
            }
    
            if(selectedLog.createdAt === log.createdAt){
                log.isShowing = !log.isShowing;
            }
        });

        setSelectedLog(selectedLog);
        setReload(!reload);
    }

    const submitLog = async (selectedLog) => {
        const logDayDocRef = await doc(db, `parents/${props.currentParent.refId}/children/${selectedLog.childRefId}/logs/${selectedLog.logRefId}`);
        const logDayDoc = await getDoc(logDayDocRef);
        await updateDoc(logDayDocRef, {
            ...logDayDoc.data(),
            submitted: true,
        })

        props.history.push('/');
        props.history.push('/logs');
    }

    return (
        <Row className='mb-3 border rounded p-3'>
            {
                showLogListHeader &&
                props.logData.map((value, index) => {
                    value.logDays.sort((first, second) => first.date - second.date);

                    return (
                        <div key={index}>
                            <Row className='mb-3 d-flex border-bottom pb-3'>
                                <Col className='col-lg-3 d-flex justify-content-start'>
                                    <h3>{value.logDays[0].type}</h3>
                                </Col>

                                <Col className='col-lg-3 d-flex justify-content-evenly'>
                                    <h3>{moment(value.logDays[0].date).format('MMM Do YYYY')}</h3>
                                </Col>

                                <Col className='col-lg-3 d-flex justify-content-evenly'>
                                    <h3>Total Time: {value.totalTime}</h3>
                                </Col>

                                <Col>
                                    <Row>
                                        <Col className='col-6 d-flex justify-content-end'>
                                            {!value.submitted && <Button variant='success' onClick={() => submitLog(value)}>Submit</Button>}
                                        </Col>
                                        <Col className='col-6 d-flex justify-content-end'>
                                            {!value.submitted && <Button onClick={() => handleSelectedLog(value)}>{value.isShowing ? `Hide Details` : `Show Details`}</Button> }
                                            {value.submitted && <h3><Badge className='display-4' pill bg='success'>Submitted</Badge></h3>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>

                            {
                                value.isShowing &&
                                props.logData
                                .filter(value => value.createdAt === selectedLog.createdAt)
                                .map((value) => {
                                    return value.logDays
                                    .sort((first, second) => first.date - second.date)
                                    .map((logDay, index) => {
                                        return <LogListItem {...props} parentLog={value} logDay={logDay} key={index}></LogListItem>
                                    });
                                })
                            }
                            </Row>
                        </div>
                    )
                })
            }
        </Row>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default LogListHeader