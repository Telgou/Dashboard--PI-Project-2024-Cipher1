import React, { useEffect, useState,forwardRef,useRef } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { Table, Form } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactToPrint from 'react-to-print';
import { setAuthToken } from '../service/api';
import { useSelector } from 'react-redux';


import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

import api from '../service/api';

const EventList = () => {
  const token = useSelector((state) => state.token);
  const componentRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    participants: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEvent, setEditEvent] = useState({
    _id: '',
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditEvent({
      _id: '',
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  const handleAddModalShow = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);

  const handleExportCSV = () => {
    // Générer les données CSV à partir de la liste des événements
    const csvData = events.map(event => ({
      Titre: event.titre,
      Description: event.description,
      "Date de début": event.dateDebut,
      "Date de fin": event.dateFin,
    }));

    // Définir les en-têtes CSV
    const headers = [
      { label: 'Titre', key: 'Titre' },
      { label: 'Description', key: 'Description' },
      { label: 'Date de début', key: 'Date de début' },
      { label: 'Date de fin', key: 'Date de fin' },
    ];

    return { csvData, headers };
  };

  const createEvent = async () => {
    setAuthToken(token);
    try {
      if (!newEvent.titre || !newEvent.description || !newEvent.dateDebut || !newEvent.dateFin) {
        Swal.fire({
          title: 'Erreur!',
          text: 'Veuillez remplir tous les champs obligatoires.',
          icon: 'error',
        });
        return;
      }

      // Validation de la date de début et de fin
      const startDate = new Date(newEvent.dateDebut);
      const endDate = new Date(newEvent.dateFin);

      if (startDate >= endDate) {
        Swal.fire({
          title: "Erreur!",
          text: "La date de début doit être antérieure à la date de fin.",
          icon: "error"
        });
        return;
      }

      // Validation de la date par rapport à la date actuelle
      const currentDate = new Date();

      if (startDate <= currentDate || endDate <= currentDate) {
        Swal.fire({
          title: "Erreur!",
          text: "Les dates doivent être ultérieures à la date actuelle.",
          icon: "error"
        });
        return;
      }

      const response = await api.post('/events/add', newEvent);
      setEvents([...events, response.data]);

      setNewEvent({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
      });
      handleAddModalClose();
      Swal.fire({
        title: 'Evénement ajouté!',
        text: 'Avec succès!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const fetchEvents = async () => {
    setAuthToken(token);
    try {
      const response = await api.get('/events/getevents');
      const eventsData = response.data;

      // Vérifiez si chaque événement a un _id valide
      const eventsWithUniqueIds = eventsData.map((event, index) => {
        if (!event._id || typeof event._id !== 'string') {
          // Si l'événement n'a pas de _id valide, créez un identifiant unique en utilisant l'index
          console.warn(`Event at index ${index} does not have a valid _id.`);
          return { id: `event_${index}`, ...event };
        }
        return { id: event._id, ...event };
      });

      setEvents(eventsWithUniqueIds);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  const deleteEvent = async (id) => {
    setAuthToken(token);
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet événement?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      denyButtonText: 'Non',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/events/deleteEvents/${id}`);
          setEvents(events.filter((event) => event._id !== id));
          Swal.fire({
            title: 'Evénement supprimé!',
            text: 'Avec succès!',
            icon: 'success',
          });
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      } else if (result.isDenied) {
        Swal.fire('Suppression annulée', '', 'info');
      }
    });
  };

  const updateEvent = async () => {
    setAuthToken(token);
    try {
      if (!editEvent.titre || !editEvent.description || !editEvent.dateDebut || !editEvent.dateFin) {
        Swal.fire({ title: "Erreur!", text: "Veuillez remplir tous les champs obligatoires.", icon: "error" });
        return;
      }

      const startDate = new Date(editEvent.dateDebut);
      const endDate = new Date(editEvent.dateFin);

      if (startDate >= endDate) {
        Swal.fire({ title: "Erreur!", text: "La date de début doit être antérieure à la date de fin.", icon: "error" });
        return;
      }

      const currentDate = new Date();

      if (startDate <= currentDate || endDate <= currentDate) {
        Swal.fire({ title: "Erreur!", text: "Les dates doivent être ultérieures à la date actuelle.", icon: "error" });
        return;
      }

      console.log("ID de l'événement à mettre à jour :", editEvent._id);
      const response = await api.patch(`/events/updateEvents/${editEvent._id}`, {
        titre: editEvent.titre,
        description: editEvent.description,
        dateDebut: editEvent.dateDebut,
        dateFin: editEvent.dateFin,
      });

      setEvents(events.map((event) => (event._id === editEvent._id ? response.data : event)));
      handleEditModalClose();
      Swal.fire({ title: 'Evénement mis à jour!', text: 'Avec succès!', icon: 'success' });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const columns = [
    { field: 'titre', headerName: 'Titre', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'dateDebut', headerName: 'Date de début', width: 180 },
    { field: 'dateFin', headerName: 'Date de fin', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="error" onClick={() => deleteEvent(params.row._id)}>
            Supprimer
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row._id)}>Modifier</Button>
        </Box>
      ),
    },
  ];
 const PrintComponent = forwardRef(({ events, columns }, ref) => (
  <Box ref={ref}>
    <h1>Liste des Événements à Imprimer</h1>
    <Table striped bordered hover>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.field}>{column.headerName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event._id}>
            {columns.map((column) => (
              <td key={column.field}>{event[column.field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </Box>
));


  const handleEditClick = (id) => {
    setShowEditModal(true);
    // Récupérer l'événement à éditer en utilisant son ID
    const eventToEdit = events.find(event => event._id === id);
    // Mettre à jour editEvent avec les données de l'événement à éditer
    setEditEvent({
      ...eventToEdit,
      // recuperation des dates
      dateDebut: eventToEdit.dateDebut ? new Date(eventToEdit.dateDebut).toISOString().substring(0, 16) : '',
      dateFin: eventToEdit.dateFin ? new Date(eventToEdit.dateFin).toISOString().substring(0, 16) : '',
    });
  };

  const { csvData, headers } = handleExportCSV();

  return (
<Box m="20px">
  <h1 className="event-title">Liste des Événements</h1>
  <Box height="75vh" width="100%" sx={{ marginTop: '20px' }}>
    <DataGrid
      rows={events}
      columns={columns}
      components={{ Toolbar: GridToolbar }}
      getRowId={(row) => row._id}
    />
  </Box>
  <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
    <Button variant="contained" color="primary" onClick={handleAddModalShow}>
      Ajouter un Événement
    </Button>
    {events.length > 0 && (
      <Box>
        <CSVLink data={csvData} headers={headers} filename={"evenements.csv"}>
          <Button variant="contained" color="primary">
            Exporter en CSV
          </Button>
        </CSVLink>
        <ReactToPrint
          trigger={() => (
            <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
              Imprimer
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Box>
    )}
  </Box>
  <div style={{ display: 'none' }}>
    <PrintComponent ref={componentRef} events={events} columns={columns} />
  </div>
  <Modal open={showAddModal} onClose={handleAddModalClose}>
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
      <Form>
        <Form.Group controlId="formTitre">
          <Form.Label>Titre</Form.Label>
          <Form.Control type="text" placeholder="Entrez le titre" value={newEvent.titre} onChange={(e) => setNewEvent({ ...newEvent, titre: e.target.value })} />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" placeholder="Entrez la description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date de début</Form.Label>
          <Form.Control type="datetime-local" value={newEvent.dateDebut} onChange={(e) => setNewEvent({ ...newEvent, dateDebut: e.target.value })} />
        </Form.Group>
        <Form.Group controlId="formDateFin">
          <Form.Label>Date de fin</Form.Label>
          <Form.Control type="datetime-local" value={newEvent.dateFin} onChange={(e) => setNewEvent({ ...newEvent, dateFin: e.target.value })} />
        </Form.Group>
        <Button variant="contained" color="primary" onClick={createEvent}>Ajouter</Button>
        <Button variant="contained" onClick={handleAddModalClose} style={{ marginLeft: 10 }}>Fermer</Button>
      </Form>
    </Box>
  </Modal>
  <Modal open={showEditModal} onClose={handleEditModalClose}>
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
      <Form>
        <Form.Group controlId="formTitreEdit">
          <Form.Label>Titre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le titre"
            value={editEvent.titre}
            onChange={(e) => setEditEvent({ ...editEvent, titre: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDescriptionEdit">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Entrez la description"
            value={editEvent.description}
            onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDateDebutEdit">
          <Form.Label>Date de début</Form.Label>
          <Form.Control
            type="datetime-local"
            value={editEvent.dateDebut}
            onChange={(e) => setEditEvent({ ...editEvent, dateDebut: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDateFinEdit">
          <Form.Label>Date de fin</Form.Label>
          <Form.Control
            type="datetime-local"
            value={editEvent.dateFin}
            onChange={(e) => setEditEvent({ ...editEvent, dateFin: e.target.value })}
          />
        </Form.Group>
        <Button variant="contained" color="primary" onClick={updateEvent}>Mettre à jour</Button>
        <Button variant="contained" onClick={handleEditModalClose} style={{ marginLeft: 10 }}>Fermer</Button>
      </Form>
    </Box>
  </Modal>
</Box>

  
  );
};

export default EventList;
