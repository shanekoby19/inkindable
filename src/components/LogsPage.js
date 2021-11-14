import React, { useState } from 'react';
import { connect } from 'react-redux';
import AddChildAlert from './AddChildAlert';
import LogList from './LogList';
import AddLogForm from './AddLogForm'
import Nav from './Nav';

const LogsPage = (props) => {
    const [showAddChildAlert, setShowAddChildAlert] = useState(props.currentParent.children.length === 0);
    const [showLogList, setShowLogList] = useState(props.currentParent.children.length !== 0); 
    const [showAddLogFrom, setShowAddLogForm] = useState(false);


    return (
        <div>
            <Nav {...props}></Nav>
            { 
              showAddChildAlert &&
              <AddChildAlert
                {...props}
              ></AddChildAlert> 
            }
            {
                showLogList &&
                <LogList
                  {...props}
                  setShowLogList={setShowLogList}
                  setShowAddLogForm={setShowAddLogForm}
                ></LogList>
            }
            {
                showAddLogFrom &&
                <AddLogForm
                  {...props}
                  setShowAddLogForm={setShowAddLogForm}
                  setShowLogList={setShowLogList}
                ></AddLogForm>
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
});

export default connect(mapStateToProps)(LogsPage);