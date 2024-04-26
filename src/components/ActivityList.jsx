// components/EventList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import api, { setAuthToken } from '../service/api';
import { useSelector } from 'react-redux';

const ActivityList = () => {
  const token = useSelector((state) => state.token);
  const [editActivity, setEditActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTypes, setFilterTypes] = useState({
    covoiturage: false,
    course: false,
    onlineMeeting: false,
    sportActivity: false,
  });
  const [newActivity, setNewActivity] = useState({
    activityName: '',
    activityTime: new Date(),
    numberOfParticipants:0 ,
    covoiturage: false,
    course: false,
    onlineMeeting: false,
    sportActivity: false,
    startingLocation: '',
    destination: '',
    availableSeats: 0,
    driverName: '',
    driverContact: '',
    courseName: '',
    instructorName: '',
    courseDuration: '',
    locationOrPlatform: '',
    meetingTitle:'',
hostName:'',
meetingDuration:'',
meetingLink:'', 
meetingAgenda:'',
sportActivityName:'',
location:'',
equipmentRequirements:'',

  });
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewActivity((prevState) => ({
      ...prevState,
      covoiturage: name === 'covoiturage' ? checked : false,
      course: name === 'course' ? checked : false,
      onlineMeeting: name === 'onlineMeeting' ? checked : false,
      sportActivity: name === 'sportActivity' ? checked : false,
    }));
    setFilterTypes((prevState) => ({
      ...prevState,
      covoiturage: name === 'covoiturage' ? checked : false,
      course: name === 'course' ? checked : false,
      onlineMeeting: name === 'onlineMeeting' ? checked : false,
      sportActivity: name === 'sportActivity' ? checked : false,
    }));
  };
  const handleEdit = (activity) => {
    setEditActivity(activity); // Set the activity to be edited
    setShowAddModal(true); // Open the modal
  };
  const renderActivityFields = () => {
    if (newActivity.covoiturage) {
      return (
        <>
          <Form.Group controlId="formStartingLocation">
            <Form.Label>Starting Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter starting location"
              value={newActivity.startingLocation}
              onChange={(e) => setNewActivity({ ...newActivity, startingLocation: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formDestination">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter destination"
              value={newActivity.destination}
              onChange={(e) => setNewActivity({ ...newActivity, destination: e.target.value })}
            />
          </Form.Group>

        <Form.Group controlId="formAvailableSeats">
          <Form.Label>Number of Available Seats</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter number of available seats"
            value={newActivity.availableSeats}
            onChange={(e) => setNewActivity({ ...newActivity, availableSeats: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDriverName">
          <Form.Label>Driver Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter driver name"
            value={newActivity.driverName}
            onChange={(e) => setNewActivity({ ...newActivity, driverName: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDriverContact">
          <Form.Label>Driver Contact Details</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter driver contact details"
            value={newActivity.driverContact}
            onChange={(e) => setNewActivity({ ...newActivity, driverContact: e.target.value })}
          />
        </Form.Group>
        </>
      );
    } else if (newActivity.course) {
      return (
        <>
         <Form.Group controlId="formCourseName">
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            value={newActivity.courseName}
            onChange={(e) => setNewActivity({ ...newActivity, courseName: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formInstructorName">
          <Form.Label>Instructor Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter instructor name"
            value={newActivity.instructorName}
            onChange={(e) => setNewActivity({ ...newActivity, instructorName: e.target.value })}
          />
        </Form.Group>
        
        <Form.Group controlId="formCourseDuration">
          <Form.Label>Course Duration</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course duration"
            value={newActivity.courseDuration}
            onChange={(e) => setNewActivity({ ...newActivity, courseDuration: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formLocationOrPlatform">
          <Form.Label>Location or Online Platform</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location or online platform"
            value={newActivity.locationOrPlatform}
            onChange={(e) => setNewActivity({ ...newActivity, locationOrPlatform: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDescriptionOrSyllabus">
          <Form.Label>Description or Syllabus</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description or syllabus"
            value={newActivity.descriptionOrSyllabus}
            onChange={(e) => setNewActivity({ ...newActivity, descriptionOrSyllabus: e.target.value })}
          />
        </Form.Group>
        </>
      );
    } else if (newActivity.onlineMeeting) {
      return (
        <>
         <Form.Group controlId="formMeetingTitle">
          <Form.Label>Meeting Title or Topic</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meeting title or topic"
            value={newActivity.meetingTitle}
            onChange={(e) => setNewActivity({ ...newActivity, meetingTitle: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formHostName">
          <Form.Label>Host or Organizer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter host or organizer name"
            value={newActivity.hostName}
            onChange={(e) => setNewActivity({ ...newActivity, hostName: e.target.value })}
          />
        </Form.Group>
     
        <Form.Group controlId="formMeetingDuration">
          <Form.Label>Meeting Duration</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meeting duration"
            value={newActivity.meetingDuration}
            onChange={(e) => setNewActivity({ ...newActivity, meetingDuration: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formMeetingPlatform">
          <Form.Label>Meeting Platform or URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meeting platform or URL"
            value={newActivity.meetingPlatform}
            onChange={(e) => setNewActivity({ ...newActivity, meetingPlatform: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formMeetingAgenda">
          <Form.Label>Meeting Agenda or Topics to be Discussed</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter meeting agenda or topics to be discussed"
            value={newActivity.meetingAgenda}
            onChange={(e) => setNewActivity({ ...newActivity, meetingAgenda: e.target.value })}
          />
        </Form.Group>
        </>
      );
    } else if (newActivity.sportActivity) {
      return (
        <>
         <Form.Group controlId="formSportActivityName">
          <Form.Label>Activity Name or Type</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter activity name or type"
            value={newActivity.sportActivityName}
            onChange={(e) => setNewActivity({ ...newActivity, sportActivityName: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formLocation">
          <Form.Label>Location (if applicable)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={newActivity.location}
            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
          />
        </Form.Group>
        
      
        <Form.Group controlId="formEquipmentRequirements">
          <Form.Label>Equipment or Requirements</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter equipment or requirements"
            value={newActivity.equipmentRequirements}
            onChange={(e) => setNewActivity({ ...newActivity, equipmentRequirements: e.target.value })}
          />
        </Form.Group>
      
        </>
      );
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
        setAuthToken(token);
      const response = await api.get('/activity/get');
      console.log('hello1');
      console.log('API Response:', response.data);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching Activities:', error);
    }
  };

  const handleAddModalShow = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);

  const updateActivity = async () => {
    try {
    
      setAuthToken(token);
      const response = await api.put(`/activity/update/${editActivity._id}`, newActivity);
      console.log("update activity makhedmetch",newActivity);
      setActivities(activities.map(activity => activity._id === editActivity._id ? response.data : activity));
      console.log("hedhi chfiha activity",activity);
      setEditActivity(null); // Reset edit mode
      handleAddModalClose(); // Close the modal
      // Show success message
    } catch (error) {
      console.log("update activity makhedmetch",newActivity);
    }
  };

  const createActivity = async () => {
    try {
       
        setAuthToken(token);
        console.log('newact', newActivity);
          // Determine which activity type checkbox is selected
    const activityType = Object.keys(filterTypes).find(key => filterTypes[key]);
      
    // Set the activity type fields based on the selected checkbox
    const activityData = {
      ...newActivity,
      [activityType]: true, // Set the selected activity type to true
    };

    // Set other activity type fields to false
    Object.keys(filterTypes).forEach(key => {
      if (key !== activityType) {
        activityData[key] = false;
      }
    });
      const response = await api.post('/Activity', newActivity);
      setActivities([...activities, response.data]);
      setNewActivity({
        activityName: '',
        activityTime: new Date(),
        numberOfParticipants:0,
        covoiturage: false,
        course: false,
        onlineMeeting: false,
        sportActivity: false,
        startingLocation: '',
        destination: '',
        availableSeats: 0,
        driverName: '',
        driverContact: '',
        courseName: '',
        instructorName: '',
        courseDuration: '',
        locationOrPlatform: '',
        meetingTitle:'',
        hostName:'',
        meetingDuration:'',
        meetingLink:'', 
        meetingAgenda:'',

        sportActivityName:'',
        location:'',
        equipmentRequirements:'',

        
      });
      fetchActivities();
      handleAddModalClose();
    
      Swal.fire({
        title: "Evénement ajouté!",
        text: "Avec succès!",
        icon: "success"
      });
    } catch (error) {
      console.error('Error creating Activity:', error);
    }
  };

  const deleteActivity = async (id) => {
    
    setAuthToken(token);
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cet événement?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/Activity/remove/${id}`);
          setActivities(activities.filter((activity) => activity._id !== id));
          Swal.fire({
            title: "Evénement supprimé!",
            text: "Avec succès!",
            icon: "success"
          });
        } catch (error) {
          console.error('Error deleting Activity:', error);
        }
      } else if (result.isDenied) {
        Swal.fire("Suppression annulée", "", "info");
      }
    });
  };

  const renderActivityTableColumns = () => {
    if (filterTypes.covoiturage) {
      return (
        <>
          <th>Activity Name</th>
          <th>Activity Time</th>
          <th>Number of Participants</th>
          <th>Starting Location</th>
          <th>Destination</th>
          <th>Available Seats</th>
          <th>Driver Name</th>
          <th>Driver Contact</th>
        </>
      );
    } else if (filterTypes.course) {
      return (
        <>
          <th>Activity Name</th>
          <th>Activity Time</th>
          <th>Number of Participants</th>
          <th>Course Name</th>
          <th>Instructor Name</th>
          <th>Course Duration</th>
          <th>Location or Platform</th>
        </>
      );
    } else if (filterTypes.onlineMeeting) {
      return (
        <>
          <th>Activity Name</th>
          <th>Activity Time</th>
          <th>Number of Participants</th>
          <th>Meeting Title</th>
          <th>Host Name</th>
          <th>Meeting Duration</th>
          <th>Meeting Link</th>
          <th>Meeting Agenda</th>
        </>
      );
    } else if (filterTypes.sportActivity) {
      return (
        <>
          <th>Activity Name</th>
          <th>Activity Time</th>
          <th>Number of Participants</th>
          <th>Sport Activity Name</th>
          <th>Location</th>
          <th>Equipment Requirements</th>
        </>
      );
    } else {
      return null;
    }
  };
  

  const renderActivityTableRows = () => {
    const filteredActivities = filterActivities();
  
    return filteredActivities.map(activity => {
      switch (true) {
        case activity.covoiturage:
          return (
            <tr key={activity.id}>
              <td>{activity.activityName}</td>
              <td>{activity.activityTime}</td>
              <td>{activity.numberOfParticipants}</td>
              <td>{activity.startingLocation}</td>
              <td>{activity.destination}</td>
              <td>{activity.availableSeats}</td>
              <td>{activity.driverName}</td>
              <td>{activity.driverContact}</td>
              <td>
                <Button variant="danger" onClick={() => deleteActivity(activity._id)}>
                  Supprimer
                </Button>
                <Button variant="primary" onClick={() => handleEdit(activity)}>
                  Modifier
                </Button>
              </td>
            </tr>
          );
        case activity.course:
          return (
            <tr key={activity.id}>
              <td>{activity.activityName}</td>
              <td>{activity.activityTime}</td>
              <td>{activity.numberOfParticipants}</td>
              <td>{activity.courseName}</td>
              <td>{activity.instructorName}</td>
              <td>{activity.courseDuration}</td>
              <td>{activity.locationOrPlatform}</td>
              <td>
                <Button variant="danger" onClick={() => deleteActivity(activity._id)}>
                  Supprimer
                </Button>
                <Button variant="primary" onClick={() => handleEdit(activity)}>
                  Modifier
                </Button>
              </td>
            </tr>
          );
        case activity.onlineMeeting:
          return (
            <tr key={activity.id}>
              <td>{activity.activityName}</td>
              <td>{activity.activityTime}</td>
              <td>{activity.numberOfParticipants}</td>
              <td>{activity.meetingTitle}</td>
              <td>{activity.hostName}</td>
              <td>{activity.meetingDuration}</td>
              <td>{activity.meetingLink}</td>
              <td>{activity.meetingAgenda}</td>
              <td>
                <Button variant="danger" onClick={() => deleteActivity(activity._id)}>
                  Supprimer
                </Button>
                <Button variant="primary" onClick={() => handleEdit(activity)}>
                  Modifier
                </Button>
              </td>
            </tr>
          );
        case activity.sportActivity:
          return (
            <tr key={activity.id}>
              <td>{activity.activityName}</td>
              <td>{activity.activityTime}</td>
              <td>{activity.numberOfParticipants}</td>
              <td>{activity.sportActivityName}</td>
              <td>{activity.location}</td>
              <td>{activity.equipmentRequirements}</td>
              <td>
                <Button variant="danger" onClick={() => deleteActivity(activity._id)}>
                  Supprimer
                </Button>
                <Button variant="primary" onClick={() => handleEdit(activity)}>
                  Modifier
                </Button>
              </td>
            </tr>
          );
        default:
          return null;
      }
    });
  };
  

  const filterActivities = () => {
    return activities.filter((activity) => {
      console.log("filterTypes is: ", filterTypes, " activity is : ", activity);
      if (filterTypes.covoiturage && activity.covoiturage) return true;
      if (filterTypes.course && activity.course) return true;
      if (filterTypes.onlineMeeting && activity.onlineMeeting) return true;
      if (filterTypes.sportActivity && activity.sportActivity) return true;
        // If no checkboxes are selected, return true to display all activities
    if (!filterTypes.covoiturage && !filterTypes.course && !filterTypes.onlineMeeting && !filterTypes.sportActivity) return true;
    
      return false;
    });
  };

  return (
    <div className="event-list-container">
      <h2>Liste des Activité</h2>
      <div>
        <Form.Check
          type="checkbox"
          label="Covoiturage"
          name="covoiturage"
          checked={filterTypes.covoiturage}
          onChange={handleCheckboxChange}
        />
        <Form.Check
          type="checkbox"
          label="Course"
          name="course"
          checked={filterTypes.course}
          onChange={handleCheckboxChange}
        />
        <Form.Check
          type="checkbox"
          label="Online Meeting"
          name="onlineMeeting"
          checked={filterTypes.onlineMeeting}
          onChange={handleCheckboxChange}
        />
        <Form.Check
          type="checkbox"
          label="Sport Activity"
          name="sportActivity"
          checked={filterTypes.sportActivity}
          onChange={handleCheckboxChange}
        />
      </div>
      <Table striped bordered hover>
        {renderActivityTableColumns()}
        {renderActivityTableRows()}
      </Table>

      <div className="d-flex justify-content-end align-items-end mb-1 mr-3">
        <Button variant="primary" onClick={handleAddModalShow}>
          Ajouter une Activité
        </Button>
      </div>

      {/* Modal pour ajouter un événement */}
      <Modal show={showAddModal} onHide={() => {
  handleAddModalClose();
  setEditActivity(null); // Reset the currently edited activity when modal is closed
}}>
        <Modal.Header closeButton>
          <Modal.Title>{editActivity ? 'Modifier une Activité' : 'Ajouter une Activité'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitre">
              <Form.Label>Activity Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom de l'activité"
                value={newActivity.activityName}
                onChange={(e) => setNewActivity({ ...newActivity, activityName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Activity Date</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Entrez la date de l'activité"
                value={newActivity.activityTime}
                onChange={(e) => setNewActivity({ ...newActivity, activityTime: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Number Of Participants</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Entrez la date de l'activité"
                value={newActivity.numberOfParticipants}
                onChange={(e) => setNewActivity({ ...newActivity, numberOfParticipants: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActivityType">
        <Form.Label>Activity Type</Form.Label>
        <div>
          <Form.Check
            type="checkbox"
            label="Covoiturage"
            name="covoiturage"
            checked={newActivity.covoiturage}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Course"
            name="course"
            checked={newActivity.course}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Online Meeting"
            name="onlineMeeting"
            checked={newActivity.onlineMeeting}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Sport Activity"
            name="sportActivity"
            checked={newActivity.sportActivity}
            onChange={handleCheckboxChange}
          />
        </div>
      </Form.Group>
      {renderActivityFields()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={editActivity ? updateActivity : createActivity}>
      {editActivity ? 'Modifier' : 'Ajouter'}
    </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActivityList;
