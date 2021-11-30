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
            status: 'Submitted',
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
                            <Row className='mb-3 border-bottom pb-3'>
                                <Col lg={4} xs={6} className='mb-3'>
                                    <h3 className='text-lg-start text-md-start text-sm-start'>{value.logDays[0].type}</h3>
                                </Col>

                                <Col lg={4} xs={6} className='mb-3'>
                                    <h3 className='text-lg-center text-md-center text-sm-start'>Total Time: {value.totalTime}</h3>
                                </Col>

                                <Col lg={4} xs={6} className='mb-3'>
                                    {value.status !== 'Submitted' && <h3 className='text-lg-end text-md-end text-sm-end'><Badge className='display-4' pill bg='warning'>Pending</Badge></h3>}
                                    {value.status === 'Submitted' && <h3 className='text-lg-end text-md-end text-sm-end'><Badge className='display-4' pill bg='success'>Submitted</Badge></h3>}
                                </Col>
                                

                                <Col xs={12} className='mt-2'>
                                    <Row>
                                        <Col className='d-flex justify-content-end'>
                                            {
                                                value.status !== 'Submitted' && 
                                                <Button 
                                                    variant='success' 
                                                    onClick={() => submitLog(value)}
                                                >Submit</Button>}
                                            {
                                                value.status !== 'Submitted' && 
                                                <Button
                                                    style={{marginLeft: `1rem`}}
                                                    onClick={() => handleSelectedLog(value)}
                                                >{value.isShowing ? `Hide Details` : `Show Details`}</Button> }
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