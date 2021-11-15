import { ConstructionOutlined, ContactlessOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';


const LogFilters = (props) => {
    useEffect(() => {
        if(props.logData.length !== 0) {
            props.setDisplayLogData(
                props.logData
                .filter(log => !currentFilterValues.currentLogTypeValue || log.type === currentFilterValues.currentLogTypeValue)
                .filter(log => currentFilterValues.currentChildNameValue === ' ' || log.childName === currentFilterValues.currentChildNameValue)
                .filter(log => !currentFilterValues.currentStatusValue || log.status === currentFilterValues.currentStatusValue.toLowerCase())
            )
        }
    }, [props.reload])

    const [currentFilterValues, setCurrentFilterValues] = useState({
        currentChildNameValue: ` `,
        currentLogTypeValue: ``,
        currentStatusValue: ``,
    });

    const updateFilterView = (filterToUpdate, value) => {
        switch (filterToUpdate) {
            case `currentChildNameValue`:
                setCurrentFilterValues({
                    ...currentFilterValues,
                    currentChildNameValue: value,
                });
                break;
            case `currentLogTypeValue`:
                setCurrentFilterValues({
                    ...currentFilterValues,
                    currentLogTypeValue: value,
                });
                break;
            case `currentStatusValue`:
                setCurrentFilterValues({
                    ...currentFilterValues,
                    currentStatusValue: value,
                });
        }
        props.setReload(!props.reload);
    }

    return (
        <Row>
            <Col className='col-lg-4 col-md-6 col-sm-12'>
                <label className='mb-3' htmlFor='input'>Child Name</label>
                <Form.Select onChange={(e) => updateFilterView(`currentChildNameValue`, e.target.value)} id='log-select' className='p-2 mb-5'>
                    { 
                        props.childData
                        .sort((first, second) => first.fName > second.fName)
                        .map((child, index) => <option key={index} value={`${child.fName} ${child.lName}`}>{`${child.fName} ${child.lName}`}</option>) 
                    }
                </Form.Select>
            </Col>
            <Col className='col-lg-4 col-md-6 col-sm-12'>
                <label className='mb-3' htmlFor='input'>Log Type</label>
                <Form.Select onChange={(e) => updateFilterView(`currentLogTypeValue`, e.target.value)} id='log-select' className='p-2 mb-5'>
                    { 
                        [``, `Volunteer Hours`, `Reading At Home`, `Peer Cards`]
                        .sort()
                        .map((logType, index) => <option key={index} value={logType}>{logType}</option>) 
                    }
                </Form.Select>
            </Col>
            <Col className='col-lg-4 col-md-6 col-sm-12'>
                <label className='mb-3' htmlFor='input'>Log Type</label>
                <Form.Select onChange={(e) => updateFilterView(`currentStatusValue`, e.target.value)} id='log-select' className='p-2 mb-5'>
                    { 
                        [``, `Pending`, `Submitted`]
                        .sort()
                        .map((status, index) => <option key={index} value={status}>{status}</option>) 
                    }
                </Form.Select>
            </Col>
        </Row>
    )
    
}

export default LogFilters;