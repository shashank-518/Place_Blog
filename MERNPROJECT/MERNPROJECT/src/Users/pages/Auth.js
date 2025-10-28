import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElement/Card.js";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/Utils/validators.js";
import { useForm } from "../../shared/hooks/formhooks.js";
import AuthContext from "../../shared/context/AuthContext.js";
import { useHttp } from "../../shared/hooks/httphooks.js";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import ImageUpload from "../../shared/components/FormElements/imageUpload.js";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setisLogin] = useState(true);
  const { Loading, sendRequest, error, errorCancel } = useHttp();
  const [formState, inputHandler, setData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const signupHandler = () => {
    if (isLogin) {
      setData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image:{
              value: "",
              isValid: false,
          }
        },
        false
      );
    }

    setisLogin((prev) => !prev);
  };
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (!isLogin) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          },
        );
        auth.login(responseData.userId ,responseData.token);
      } catch (e) {}
    } else {
      try {

        const formData = new FormData();
        formData.append('name',formState.inputs.name.value);
        formData.append('email',formState.inputs.email.value)
        formData.append('password',formState.inputs.password.value)
        formData.append('image',formState.inputs.image.value)
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        
        auth.login(responseData.userId, responseData.token);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorCancel} />

      <Card className="authentication">
        {Loading && <LoadingSpinner overlay />}
        <h2>{isLogin ? "SINGUP" : "LOGIN"} Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {isLogin && (
            <Input
              element="input"
              id="name"
              type="name"
              label="Your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid Name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />

          {isLogin && <ImageUpload id="image" center onInput={inputHandler}/>}
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "SINGUP" : "LOGIN"}
          </Button>
        </form>

        <Button inverse onClick={signupHandler}>
          Switch To {isLogin ? "Login" : "Signup"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
