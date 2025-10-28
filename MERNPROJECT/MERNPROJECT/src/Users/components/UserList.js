import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElement/Card";
import './UserList.css'

const UserList = (props) => {
  if (props.items.length === 0) {
    return <Card>
       <h1 className="center">No User Found</h1>
    </Card>
  } else {
    return (
      <ul className="users-list">
        {props.items.map((User) => (
          <UserItem
            key={User.id}
            id = {User.id}
            name={User.name}
            image={User.image}
            placeCount={User.places.length}
          />
        ))}
      </ul>
    );
  }
};

export default UserList;
