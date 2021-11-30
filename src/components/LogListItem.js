import React, { useState, useRef } from 'react';
import { Button, Row, Container, Col, Badge, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import db from '../firebase/firebase';

const LogListItem = (props) => {
    const [reload, setReload] = useState(false);
    const [showRecommendation, setShowRecommendation] = useState(false);
    const titleRef = useRef(props.logDay.title || ``);
    const minutesRef = useRef(props.logDay.minutes || 0);

    const toggleButtonState = () => {
        props.logDay.isShowing = !props.logDay.isShowing;
        setReload(!reload);
    }

    const handleEditLogDay = async (selectedLogDay) => {
        if(props.logDay.isShowing) {
            // Save data to the database.
            const logDayDocRef = await doc(db, `parents/${props.currentParent.refId}/children/${props.parentLog.childRefId}/logs/${props.parentLog.logRefId}`);
            const logDayDoc = await getDoc(logDayDocRef);
            const newLogDays = logDayDoc.data().logDays.filter(logDay => logDay.date !== selectedLogDay.date);

            await updateDoc(logDayDocRef, {
                totalTime: newLogDays.reduce((prevValue, currentLog) => prevValue + currentLog.minutes, Number.parseInt(minutesRef.current.value)),
                logDays: [...newLogDays, {
                    ...selectedLogDay,
                    status: 'Saved',
                    isShowing: null,
                    title: titleRef.current.value,
                    minutes: Number.parseInt(minutesRef.current.value),
                    lastEditAt: moment().valueOf(),
                }]
            });

            props.history.push('/');
            return props.history.push('/logs');
        }
        toggleButtonState();
    }

    const determineActivityTitle = (type) => {
        switch(type) {
            case 'Reading At Home':
                return `Book Title`;
            case 'Volunteer Hours':
                return `What did you do?`;
            case 'Peer Cards':
                return `Activity Title`;
        }
    }

    const determineActivityTimeTitle = (type) => {
        switch(type) {
            case 'Reading At Home':
                return `Time spent reading (minutes)`;
            case 'Volunteer Hours':
                return `Time spent volunteering (minutes)`;
            case 'Peer Cards':
                return `Time spent on activity (minutes)`;
        }
    }

    return (

        <Container>
            <Row className='mb-3 pb-2 border-bottom border-2'>
                <Col lg={3} sm={6} xs={12} className='mb-3'>
                    <h3>{props.logDay.type}</h3>
                </Col>
                <Col lg={3} sm={6} xs={12} className='mb-3'>
                    <h3 className='text-md-end text-sm-end'>{moment(props.logDay.date).format('MMM. Do, YYYY')}</h3>
                </Col>
                <Col lg={3} sm={6} xs={12}>
                    <h3 className='text-lg-end'>
                        <Badge 
                            pill 
                            bg={props.logDay.status === 'Pending' ? 'warning' : 'success'}
                        >{props.logDay.status}</Badge>
                    </h3>
                </Col>
                <Col lg={3} sm={6} xs={12}>
                    <Row>
                        <Col className='d-flex justify-content-end'>
                            { 
                                props.logDay.isShowing && 
                                <Button 
                                    variant='danger' 
                                    onClick={toggleButtonState}
                                >Cancel</Button>
                            }
                            <Button
                                style={{marginLeft: '1rem'}}
                                variant={props.logDay.isShowing ? 'success' : 'info'} 
                                onClick={() => handleEditLogDay(props.logDay)}
                            >{ props.logDay.isShowing ? `Save`: `Edit` }</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {
                props.logDay.isShowing &&
                <Container>
                    {
                        props.logDay.type === `Peer Cards` && props.logDay.description && 
                        <Row>
                            <Col className='mb-2' xs={12}>
                                <Form.Check
                                    type='checkbox'
                                    label='Show Recommendation'
                                    onClick={(e) => setShowRecommendation(e.target.checked)}
                                ></Form.Check>
                            </Col>
                            <Col xs={12}>
                                {
                                    showRecommendation &&
                                    <ul>
                                        <li>Activity: {props.logDay.description}</li>
                                        <li>Time: {props.logDay.recommended_time} minutes</li>
                                    </ul>
                                }
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col lg={9} xs={12} className='my-3 d-flex flex-column'>
                            <label className='my-3'>{determineActivityTitle(props.logDay.type)}</label>
                            <input className='text-center p-3 display-6' ref={titleRef} defaultValue={props.logDay.title}></input>
                        </Col>
                        <Col lg={3} xs={12} className='mt-3 d-flex flex-column'>
                            <label className='my-3'>{determineActivityTimeTitle(props.logDay.type)}</label>
                            <input className='text-center p-3 display-6'  ref={minutesRef} defaultValue={props.logDay.minutes}></input>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col className='d-flex justify-content-end col-12'>
                            <p className='text-success'>Last Updated On: {moment(props.logDay.lastEditAt).format('MMMM Do')} at  {moment(props.logDay.lastEditAt).format('h:mmA')}</p>
                        </Col>
                    </Row>
                </Container>
            }
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent
})

export default connect(mapStateToProps)(LogListItem);