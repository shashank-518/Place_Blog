import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElement/Modal";
import Map from "../../shared/components/UIElement/Map";
import AuthContext from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import { useHttp } from "../../shared/hooks/httphooks";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [mapHandler, setMapHandler] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { Loading, error, sendRequest, errorCancel } = useHttp();

  const openMapHandler = () => setMapHandler(true);
  const closeMapHandler = () => setMapHandler(false);
  const showWarning = () => setShowConfirmModal(true);
  const showCancel = () => setShowConfirmModal(false);

  const showDeleting = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (e) {}
  };

  return (
    <>
      {/* Map Modal */}
      <Modal
        show={mapHandler}
        onCancel={closeMapHandler}
        header={props.address}
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map coordinate={props.coordinates} />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onCancel={showCancel}
        header="Are You Sure?"
        footer={
          <>
            <Button inverse onClick={showCancel}>
              Cancel
            </Button>
            <Button danger onClick={showDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="delete-warning">
          Do you want to delete this place? This action cannot be undone.
        </p>
      </Modal>

      <ErrorModal error={error} onClear={errorCancel} />

      <li className="place-item">
        <Card className="place-card">
          {Loading && <LoadingSpinner asOverlay />}

          <div className="place-image">
            <img
              src={`http://localhost:5000/${props.imageURL}`}
              alt={props.title}
            />
          </div>

          <div className="place-info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <h3>{props.address}</h3>
          </div>

          <div className="place-actions">
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.userId === props.creator && (
              <>
                <Button to={`/places/${props.id}`}>Edit</Button>
                <Button danger onClick={showWarning}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
