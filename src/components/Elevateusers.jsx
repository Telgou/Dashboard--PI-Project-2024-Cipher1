// components/lessprivuserList.js
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../service/api';
import { Box, Typography, Divider, useTheme, Modal, Button, TextField, Grid, Select, MenuItem } from "@mui/material";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import '../css/Elevateusers.css'

const ElevateUsers = () => {
    const departments = ['Informatique', 'Business', 'Mecanique', 'Mathematics'];
    const pedagogicalUnits = ['Python', 'Java', 'React', 'Angular'];
    const token = useSelector((state) => state.token);
    const [enabled] = useStrictDroppable(false);
    const [LessPrivUsers, setLessPrivUsers] = useState([]);
    const [usersByRole, setUsersByRole] = useState({
        prof: [],
        coordinator: [],
        depHead: [],
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [droppableId, setDroppableId] = useState(null);
    const [Data, setData] = useState({ department: '', pedagogicalUnit: '' });

    useEffect(() => {
        fetchlessprivilegedusers();
    }, []);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const AddModalShow = () => setShowAddModal(true);
    const AddModalClose = () => setShowAddModal(false);

    const fetchlessprivilegedusers = async () => {
        try {
            const response = await api.get('/users/getlesspriv', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Sorting by valid FALSE first
            setLessPrivUsers(response.data);

            const organizedUsers = {
                prof: [],
                coordinator: [],
                depHead: [],
            };
            response.data.forEach(user => {
                organizedUsers[user.role].push(user);
            });
            setUsersByRole(organizedUsers);
        } catch (error) {
            console.error('Error fetching LessPrivUsers:', error);
        }
    };

    const sort = (list) => {
        const sortedLessPrivUsers = list.sort((a, b) => {
            if (a.valid === b.valid) return 0;
            return a.valid ? 1 : -1;
        })
        return sortedLessPrivUsers;
    }
    ////////////////////
    const onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        const user = usersByRole[source.droppableId][source.index];
        setSelectedUser(user);

        setDroppableId(destination.droppableId);
        console.log(selectedUser)

        setModalOpen(true);

    };

    const ModalSubmit = () => {

        Swal.fire({
            title: "Are you sure about changing this user's position ?",
            showDenyButton: true,
            //showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: "NO",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {

                    const formData = new FormData();
                    if (droppableId === 'depHead') {
                        formData.append('dep', Data.department);
                    } else if (droppableId === 'coordinator') {
                        formData.append('UP', Data.pedagogicalUnit);
                    }
                    formData.append('userid', selectedUser._id)

                    for (const entry of formData.entries()) {
                        console.log(entry[0], entry[1], entry[3]);
                    }
                    let verificationresp = await api.post(`/auth/promote`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    console.log(verificationresp)
                    if (verificationresp.status === 200) {
                        Swal.fire({
                            title: "Position changed successfully!",
                            text: "Success!",
                            icon: "success"
                        });
                        /*const updatedLessPrivUsers = LessPrivUsers.map(lessprivuser => {
                            if (lessprivuser.email === email) {
                                return { ...lessprivuser, valid: verificationresp.data.verified };
                            } else {
                                return lessprivuser;
                            }
                        });
                        setLessPrivUsers(sort(updatedLessPrivUsers));*/
                    } else if (verificationresp.status === 201) {
                        Swal.fire({
                            title: "User is already in that position !",
                            text: "Success!",
                            icon: "success"
                        });

                    } else {
                        Swal.fire({
                            title: "A problem has occured try again !",
                            text: "Try again !",
                            icon: "error"
                        });
                    }
                    fetchlessprivilegedusers();
                } catch (error) {
                    Swal.fire({
                        title: "A problem has occured !",
                        text: "You might not be allowed to elevate that user privilege  !",
                        icon: "error"
                    });
                }
            } else if (result.isDenied) {
                Swal.fire("Promotion aborted", "", "info");
            }
        });

        // hide modal
        setData({ department: '', pedagogicalUnit: '' });
        setModalOpen(false);
    };



    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="container" style={{ width: 'max-content' }}>
                    <div className="row">
                        {Object.entries(usersByRole).map(([role, roleUsers]) => (
                            <div key={role} className="col" >
                                <h2 style={{ width: 'max-content' }}>{role === 'prof' ? 'Professors' : role === 'coordinator' ? 'Coordinators' : 'Department Heads'}</h2>
                                {enabled && (
                                    <Droppable droppableId={role}>
                                        {(provided) => (
                                            <div className="draggable-container" ref={provided.innerRef} {...provided.droppableProps}>
                                                {roleUsers.map((user, index) => (
                                                    <Draggable key={user._id} draggableId={user._id} index={index}>
                                                        {(provided) => (
                                                            <div className="user-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div className="user-card-body">
                                                                    <img className="user-image" alt="user" src={`http://localhost:3001/assets/${user.picturePath}`} />
                                                                    <div className="user-details">
                                                                        <p className="card-text">Name:{user.firstName} {user.lastName}</p>
                                                                        <p className="card-text">Email:{user.email}</p>
                                                                        <p className="card-text"><b>{user.role === 'depHead' ? 'Department :' : user.role === 'coordinator' ? 'UP :' : ''}</b> {user.role === 'depHead' ? user.department : user.role === 'coordinator' ? user.UP : ''}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={ModalSubmit}
                aria-labelledby="edit-user-info-modal"
                aria-describedby="modal-to-edit-user-information"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h4" id="modal-title" sx={{ py: 4 }}>
                        {droppableId === 'depHead' ? 'Choose Department' : droppableId === 'coordinator' ? 'Choose Pedagogical Unit' : 'The User will be demoted to a normal professor'}
                    </Typography>

                    <Grid container spacing={2}>
                        {droppableId === 'depHead' &&
                            <Grid item xs={12}>
                                <Select
                                    labelId="department-label"
                                    id="department"
                                    value={Data.department || ''}
                                    onChange={(e) => setData({ ...Data, department: e.target.value })}
                                    label="Department"
                                    fullWidth
                                >
                                    {departments.map((department, index) => (
                                        <MenuItem key={index} value={department}>{department}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        }

                        {droppableId === 'coordinator' &&
                            <Grid item xs={12}>
                                <Select
                                    labelId="pedagogical-unit-label"
                                    id="pedagogicalUnit"
                                    value={Data.pedagogicalUnit || ''}
                                    onChange={(e) => setData({ ...Data, pedagogicalUnit: e.target.value })}
                                    label="Pedagogical Unit"
                                    fullWidth
                                >
                                    {pedagogicalUnits.map((unit, index) => (
                                        <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        }
                    </Grid>

                    <Box mt={2} textAlign="right">
                        <Button variant="contained" className='mx-1' onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={ModalSubmit}>
                            Update
                        </Button>
                    </Box>

                </Box>
            </Modal>

            <div className='col-12 dragtext' >
                <span style={{ fontSize: '20px', color: 'red', width: 'max-content' }}>❗Drag & Drop the user, then choose his new Department / PedagogicalUnit</span>
            </div>

        </div>
    );

};

export default ElevateUsers;



{ /*<div className="lessprivuser-list-container">
            <h2 className='text-center'> Users List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className='px-4'>Email</th>
                        <th className='px-5'>Role</th>
                        <th style={{ textAlignLast: 'center' }} colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {LessPrivUsers.map((lessprivuser) => (
                        <tr key={lessprivuser.lessprivuserId}>
                            <td className='px-4'>{lessprivuser.email}</td>
                            <td className='px-5'>{lessprivuser.role}</td>

                            <td style={buttonCell} >
                                <Button variant="primary" className='mx-5' onClick={() => validate(lessprivuser.email, lessprivuser.role)}>
                                    {lessprivuser.role ? "Unvalidate" : "Validate"}
                                </Button>
                            </td>
                            <td width={"50%"} className='text-center'>
                                <Button variant="danger" className='mx-5' onClick={() => deletelessprivuser(lessprivuser.email)}>
                                    delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal pour ajouter un événement 
            <Modal show={showAddModal} onHide={AddModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>créer un lessprivuser</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.lessprivuser controlId="formID">
                            <Form.Label>lessprivuser ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le lessprivuser id"
                                value={newlessprivuser.lessprivuserId}
                                onChange={(e) => setnewlessprivuser({ ...newlessprivuser, lessprivuserId: e.target.value })}
                            />
                        </Form.lessprivuser>
                        <Form.lessprivuser controlId="formName">
                            <Form.Label>lessprivuser Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le lessprivuser admin ID"
                                value={newlessprivuser.lessprivuserName}
                                onChange={(e) => setnewlessprivuser({ ...newlessprivuser, lessprivuserName: e.target.value })}
                            />
                        </Form.lessprivuser>
                        <Form.lessprivuser controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Entrez la description"
                                value={newlessprivuser.description}
                                onChange={(e) => setnewlessprivuser({ ...newlessprivuser, description: e.target.value })}
                            />
                        </Form.lessprivuser>
                        <Form.lessprivuser controlId="formMembers">
                            <Form.Label>Members</Form.Label>
                            <Form.Select
                                multiple
                                value={newlessprivuser.members ? newlessprivuser.members.map(member => member.userId) : []}
                                onChange={(e) => {
                                    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                                    const selectedUsers = users.filter(user => selectedValues.includes(user._id));
                                    setnewlessprivuser({ ...newlessprivuser, members: selectedUsers });
                                }}
                            >
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {`${user.firstName} ${user.lastName}`}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.lessprivuser>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={AddModalClose}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={createlessprivuser}>
                        Ajouter
                    </Button>
                </Modal.Footer>
                                </Modal>}
        </div>*/}



export const useStrictDroppable = (loading) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        let animation;

        if (!loading) {
            animation = requestAnimationFrame(() => setEnabled(true));
        }

        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [loading]);

    return [enabled];
};
