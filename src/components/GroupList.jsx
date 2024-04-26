// components/GroupList.js
import React, { useEffect, useState } from 'react';
import api from '../service/api';
import { Table , Button, Modal, Form} from 'react-bootstrap';
import Swal from 'sweetalert2';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroup, setnewGroup] = useState({
    groupName: '',
    NumMumber: '',
    description: '',
    members: [],
  });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups/get');
      console.log('API Response:', response.data);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };
  const fetchUsers = async () => {
     try { 
      const response = await api.get('/users/get');
       console.log('API Response:', response.data); 
       setUsers(response.data); 
       const users = response.data.map(user => ({ ...user, value: user._id, label: '${user.firstName} ${user.lastName}', })); 
       setUsers(users);} 
       catch (error) { 
        console.error('Error fetching users:', error); 
      }
     };
     const [showEditModal, setShowEditModal] = useState(false);
     const [editGroup, setEditGroup] = useState({
    groupName: '',
    description: '',
    members: [],
  });
  const handleAddModalShow = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);
  const handleEditModalShow = (group) => {
    setEditGroup({
      ...group,
      members: group.members.map(member => member._id), // Assuming member._id is the correct identifier for members
    });
    setShowEditModal(true);
  };
  const handleEditModalClose = () => setShowEditModal(false);


  const createGroup = async () => {
    try {
      const userIds = newGroup.members.map(member => ({ userId: member._id }));
      const response = await api.post('/addgroup', { ...newGroup, members: userIds });
      setGroups([...groups, response.data]);
      setnewGroup({
        groupName: '',
        description: '',
        members: [],
      });
      handleAddModalClose();
      Swal.fire({
        title: "Group ajouté!",
        text: "Avec succès!",
        icon: "success"
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
    fetchGroups();
  };

  const deleteGroup = async (id) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce groupe?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/groups/${id}/delete`);
          await setGroups(groups.filter((group) => group._id !== id));
          Swal.fire({
            title: "groupe supprimé!",
            text: "Avec succès!",
            icon: "success"
          });
        } catch (error) {
          console.error('Error deleting group:', error);
        }
      } else if (result.isDenied) {
        Swal.fire("Suppression annulée", "", "info");
      }
    });
  };

  const updateGroup = async () => {
    try {
      // Vérifier si les champs requis sont renseignés
      if ( !editGroup.groupName || !editGroup.description) {
        Swal.fire({
          title: "Erreur!",
          text: "Veuillez remplir tous les champs obligatoires.",
          icon: "error"
        });
        return;
      }
      if (!editGroup._id) {
        console.error('Group ID is missing.');
        return;
      }
  
      const response = await api.put(`/groups/${editGroup._id}/update`, {
        //groupId: editGroup.groupId,
       // groupAdminId: editGroup.groupAdminId,
        groupName: editGroup.groupName,
        description: editGroup.description,
        members: editGroup.members,
      });
  
      setGroups(groups.map((group) => (group._id === editGroup._id ? response.data : group)));
      handleEditModalClose();
      Swal.fire({
        title: 'Groupe mis à jour!',
        text: 'Avec succès!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error updating group:', error);
    }
    fetchGroups();
  };
  return (
    <div className="group-list-container">
      <h2>Liste des Groupes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number of Members</th>
            <th>description</th>
            <th>members</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.groupId}>
              <td>{group.groupName}</td>
              <td>{group.NumMumber}</td>
              <td>{group.description}</td>
              <td>
              {group.members?.map((member) => (
  <div key={member.memberId}>
    {`NOM: ${member.firstName}, Prenom: ${member.lastName}`}
  </div>
))}
</td>
<td>
                <Button variant="danger" onClick={() => deleteGroup(group._id)}>
                  Supprimer
                </Button>
                <Button variant="primary" onClick={() => handleEditModalShow(group)}>
                Editer
               </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end align-items-end mb-1 mr-3">
        <Button variant="primary" onClick={handleAddModalShow}>
        créer un groupe
        </Button>
      </div>

      {/* Modal pour ajouter un événement */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>créer un groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Groupe Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le groupe admin ID"
                value={newGroup.groupName}
                onChange={(e) => setnewGroup({ ...newGroup, groupName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Entrez la description"
                value={newGroup.description}
                onChange={(e) => setnewGroup({ ...newGroup, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formMembers">
  <Form.Label>Members</Form.Label>
  <Form.Select
    multiple
    value={newGroup.members ? newGroup.members.map(member => member.userId) : []}
    onChange={(e) => {
      const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
      const selectedUsers = users.filter(user => selectedValues.includes(user._id));
      setnewGroup({ ...newGroup, members: selectedUsers });
    }}
  >
    {users.map(user => (
      <option key={user._id} value={user._id}>
        {`${user.firstName} ${user.lastName}`}
      </option>
    ))}
  </Form.Select>
</Form.Group>
 
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={createGroup}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal pour éditer un événement */}
<Modal show={showEditModal} onHide={handleEditModalClose}>
  <Modal.Header closeButton>
    <Modal.Title>Éditer un Groupe</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formName">
        <Form.Label>Groupe Name</Form.Label>
        <Form.Control
          type="text"
          value={editGroup.groupName}
          onChange={(e) => setEditGroup({ ...editGroup, groupName: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="textarea"
          value={editGroup.description}
          onChange={(e) => setEditGroup({ ...editGroup, description: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="formMembers">
      <Form.Label>Members</Form.Label>
      <Form.Select
      multiple
          value={editGroup.members ? editGroup.members.map(member => member.userId) : []}
          onChange={(e) =>{
            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
            const selectedUsers = users.filter(user => selectedValues.includes(user._id));
            setEditGroup({ ...editGroup, members: selectedUsers });
            }}
        >
          {users.map(user => (
      <option key={user._id} value={user._id}>
        {`${user.firstName} ${user.lastName}`}
      </option>
    ))}
     </Form.Select>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleEditModalClose}>
      Fermer
    </Button>
    <Button variant="primary" onClick={updateGroup}>
      Mettre à jour
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default GroupList;
