import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttp } from "../../shared/hooks/httphooks";

const User = () => {
  const [LoadedData, setLoadedData] = useState();
  const { Loading, error, sendRequest, errorCancel } = useHttp();

  useEffect(() => {
    const fetchrequest = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );

        setLoadedData(responseData.users);
      } catch (e) {}
    };

    fetchrequest();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={errorCancel} />
      {Loading && (
        <div className="center">
          <LoadingSpinner overlay />
        </div>
      )}
      {!Loading && LoadedData && <UserList items={LoadedData} />}
    </>
  );
};

export default User;
