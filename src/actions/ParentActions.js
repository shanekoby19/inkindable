import db from '../firebase/firebase'
import { addDoc, collection, deleteDoc, doc, query, where } from '@firebase/firestore';
import { getDoc, getDocs, updateDoc } from 'firebase/firestore';

const parentsCollection = collection(db, 'parents');

export const addParent = (parent) => ({
    type: 'CREATE_PARENT',
    parent,
});

export const startAddParent = (parent) => {
    return (dispatch) => {
        addDoc(parentsCollection, parent)
        .then((ref) => {
            dispatch(addParent({
                refId: ref.id,
                ...parent,
            }))
        })
        .catch(e => console.log(e));
    };
};

export const deleteParent = (refId) => ({
    type: 'DELETE_PARENT',
    refId,
})

export const startDeleteParent = (refId) => {
    return (dispatch) => {
        const parentDoc = doc(parentsCollection, `${refId}`);
        deleteDoc(parentDoc)
        .then(() => {
            dispatch(deleteParent(refId));
        })
        .catch(e => setError(e));
    }
}

export const loadParent = (parent) => ({
    type: 'LOAD_PARENT',
    parent,
})

export const startLoadParent = (uid) => {
    return (dispatch) => {
        getDocs(query(parentsCollection, where('uid', '==', uid)))
        .then(snapshot => snapshot.forEach(parent => dispatch(loadParent({refId: parent.id, ...parent.data()}))))
        .catch(error => console.log(error));
    }
}

export const updateParent = (parent) => ({
    type: 'UPDATE_PARENT',
    parent,
})

export const startUpdateParent = (refId, email, fName, lName, dob) => {
    return (dispatch) => {
        const parentDoc = doc(parentsCollection, `${refId}`);
        updateDoc(parentDoc, {
            ...(email && {email}),
            ...(fName && {fName}),
            ...(lName && {lName}),
            ...(dob && { dob }),
        })
        .then(() => {
            getDoc(parentDoc)
            .then(snapshot => {
                dispatch(updateParent({
                    refId,
                    ...snapshot.data()
                }));
            })
        })
        .catch(e => console.log(e));
    }
}