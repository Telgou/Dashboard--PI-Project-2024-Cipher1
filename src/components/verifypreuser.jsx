// components/PreUserList.js
import React, { useEffect, useState } from 'react';
import api from '../service/api';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
const PreusersList = () => {
    const [preusers, setPreUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchPreUsers();
    }, []);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const handleAddModalShow = () => setShowAddModal(true);
    const handleAddModalClose = () => setShowAddModal(false);

    const token = useSelector((state) => state.token);

    const fetchPreUsers = async () => {
        try {
            const response = await api.get('/auth/preusers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API Response:', response.data);
            // Sorting by valid FALSE first
            setPreUsers(sort(response.data));
        } catch (error) {
            console.error('Error fetching preusers:', error);
        }
    };

    const validate = async (email, valid) => {
        Swal.fire({
            title: "Are you sure about validating this Preregistration?",
            showDenyButton: true,
            //showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: "NO",
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(valid)
                try {
                    let verificationresp = await api.put(`/auth/verifyuser/${email}/${valid}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(verificationresp)
                    if (verificationresp.status === 200) {
                        Swal.fire({
                            title: verificationresp.data.verified === true ? "preuser verified!" : "preuser unverified",
                            text: "Success!",
                            icon: "success"
                        });
                        const updatedPreusers = preusers.map(preuser => {
                            if (preuser.email === email) {
                                return { ...preuser, valid: verificationresp.data.verified };
                            } else {
                                return preuser;
                            }
                        });
                        setPreUsers(sort(updatedPreusers));
                    }

                    if (verificationresp.status === 204) {
                        Swal.fire({
                            title: verificationresp.data.verified === true ? "preuser ALREADY verified!" : "preuser ALREADY unverified",
                            text: "Success!",
                            icon: "success"
                        });
                        const updatedPreusers = preusers.map(preuser => {
                            if (preuser.email === email) {
                                return { ...preuser, valid: !valid };
                            } else {
                                return preuser;
                            }
                        });
                        setPreUsers(sort(updatedPreusers));
                    }

                } catch (error) {
                    console.error('Error verifying preuser:', error);
                }
            } else if (result.isDenied) {
                Swal.fire("Verification aborted", "", "info");
            }
        });
    };

    const deletePreUser = async (email) => {
        Swal.fire({
            title: "Are you sure about deleting this Preregistration?",
            showDenyButton: true,
            //showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: "NO",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/auth/preusers/${email}/delete`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setPreUsers(updatedPreUsersResponse.data);
                    Swal.fire({
                        title: "preuser deleted!",
                        text: "Success!",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error deleting preuser:', error);
                }
            } else if (result.isDenied) {
                Swal.fire("Deletion aborted", "", "info");
            }
        });
    };

    const sort = (list) => {
        const sortedPreUsers = list.sort((a, b) => {
            if (a.valid === b.valid) return 0;
            return a.valid ? 1 : -1;
        })
        return sortedPreUsers;
    }
    const buttonCell = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    return (
        <div className="preuser-list-container">
            <h2 className='text-center'> PreregisteredUsers List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className='px-4'>Email</th>
                        <th className='px-5'>Valid</th>
                        <th style={{ textAlignLast: 'center' }} colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {preusers.map((preuser) => (
                        <tr key={preuser.preuserId}>
                            <td className='px-4'>{preuser.email}</td>
                            <td className='px-5'>{preuser.valid ? "True" : "False"}</td>

                            <td style={buttonCell} >
                                <Button variant="primary" className='mx-5' onClick={() => validate(preuser.email, preuser.valid)}>
                                    {preuser.valid ? "Unvalidate" : "Validate"}
                                </Button>
                            </td>
                            <td width={"50%"} className='text-center'>
                                <Button variant="danger" className='mx-5' onClick={() => deletePreUser(preuser.email)}>
                                    delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/*
            <Modal show={showAddModal} onHide={handleAddModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>créer un preuser</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.PreUser controlId="formID">
                            <Form.Label>PreUser ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le preuser id"
                                value={newPreUser.preuserId}
                                onChange={(e) => setnewPreUser({ ...newPreUser, preuserId: e.target.value })}
                            />
                        </Form.PreUser>
                        <Form.PreUser controlId="formName">
                            <Form.Label>PreUser Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le preuser admin ID"
                                value={newPreUser.preuserName}
                                onChange={(e) => setnewPreUser({ ...newPreUser, preuserName: e.target.value })}
                            />
                        </Form.PreUser>
                        <Form.PreUser controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Entrez la description"
                                value={newPreUser.description}
                                onChange={(e) => setnewPreUser({ ...newPreUser, description: e.target.value })}
                            />
                        </Form.PreUser>
                        <Form.PreUser controlId="formMembers">
                            <Form.Label>Members</Form.Label>
                            <Form.Select
                                multiple
                                value={newPreUser.members ? newPreUser.members.map(member => member.userId) : []}
                                onChange={(e) => {
                                    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                                    const selectedUsers = users.filter(user => selectedValues.includes(user._id));
                                    setnewPreUser({ ...newPreUser, members: selectedUsers });
                                }}
                            >
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {`${user.firstName} ${user.lastName}`}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.PreUser>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddModalClose}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={createPreUser}>
                        Ajouter
                    </Button>
                </Modal.Footer>
                                </Modal>*/}
        </div>
    );
};

export default PreusersList;
