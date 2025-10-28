import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useHttp } from "../../shared/hooks/httphooks";

import "./UserPlace.css"; // ✅ New CSS file for basic styling

const UserPlace = () => {
  const [loadedData, setLoadedData] = useState();
  const userId = useParams().uid;

  const { loading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedData(responseData.places);
      } catch (e) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedId) => {
    setLoadedData((prevData) =>
      prevData.filter((place) => place.id !== deletedId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      {loading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!loading && loadedData && (
        <PlaceList items={loadedData} onDelete={placeDeleteHandler} />
      )}

      {!loading && loadedData && loadedData.length === 0 && (
        <div className="center no-places">
          <h2>No places found. Maybe create one?</h2>
        </div>
      )}
    </>
  );
};

export default UserPlace;
