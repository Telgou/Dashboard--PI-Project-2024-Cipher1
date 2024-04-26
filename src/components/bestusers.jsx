import React, { useEffect, useState } from 'react';
import api from '../service/api';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Bestusers = () => {
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const AddModalShow = () => setShowAddModal(true);
    const AddModalClose = () => setShowAddModal(false);

    const token = useSelector((state) => state.token);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/users/getskills', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API Response:', response.data);
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    useEffect(() => {
        if (selectedSkill !== '') {
            fetchAssociatedUsers();
        }
    }, [selectedSkill]);

    const fetchAssociatedUsers = async () => {
        try {
            const response = await api.post('/users/getskilledusers', { skill: selectedSkill }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('API Response:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const SkillChange = (event) => {
        setSelectedSkill(event.target.value);
    };

    const buttonCell = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    return (
        <div className="users-list-container mx-5" style={{ width: 'max-content' }}>
            <h2 className='text-center py-5'> Users List By Skill Scores</h2>

            <FormControl style={{ width: '100%' }} className='py-3'>
                <InputLabel id="skill-select-label" sx={{ fontSize: '1.2rem' }}>Select a skill</InputLabel>
                <Select
                    labelId="skill-select-label"
                    id="skill-select"
                    value={selectedSkill}
                    onChange={SkillChange}
                >
                    <MenuItem value="">Select a skill</MenuItem>
                    {skills.map((skill) => (
                        <MenuItem key={skill._id} value={skill.name}>{skill.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>


            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className='px-4'>Name</th>
                        <th className='px-4'>Email</th>
                        <th style={{ textAlignLast: 'center' }} colSpan={2}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => (
                        <tr key={user._id}>
                            <td className='px-4'>{user.firstName + ' ' + user.lastName}</td>
                            <td className='px-4'>{user.email}</td>
                            <td style={buttonCell} >
                                {user.totalScore}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div>
    );
};

export default Bestusers;
