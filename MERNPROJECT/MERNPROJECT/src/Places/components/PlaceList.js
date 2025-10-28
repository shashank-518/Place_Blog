import React from "react";
import Card from "../../shared/components/UIElement/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list__empty">
        <Card className="place-list__empty-card">
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          title={place.title}
          imageURL={place.image}
          description={place.description}
          address={place.address}
          creator={place.creator}
          coordinates={place.location}
          onDelete={props.onDelete}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
