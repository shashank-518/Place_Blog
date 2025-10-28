import React, { useReducer , useEffect } from "react";
import { validate } from "../../Utils/validators";

import "./Input.css";

const Input = (props) => {
  const inputhandler = (state, action) => {
    switch (action.type) {
      case "Change":
        return {
          ...state,
          value: action.val,
          isValid: validate(action.val , action.validators),
        }
      case "Touch":
        return{
          ...state,
          isTouch : true
        }

      default:
        return state;
    }
  };

  const [inputState, dispatch] = useReducer(inputhandler, {
    value: props.value || '',
    isValid: props.valid || '',
    isTouch:false
  });

  const {id , onInput} = props;
  const {value , isValid} = inputState;

  useEffect(()=>{
    onInput(id , value , isValid)
  } , [id , value , isValid ,onInput])

  const ChangeHandler = (event) => {
    dispatch({ type: "Change", val: event.target.value , validators : props.validators});
  };

  const touchHandler = () =>{
    dispatch({
      type: "Touch" 
    })
  }

  const content =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={ChangeHandler}
        onBlur = {touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea id={props.id} rows={props.rows || 3} onChange={ChangeHandler} value={inputState.value} onBlur = {touchHandler} />
    );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouch && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {content}
      {!inputState.isValid && inputState.isTouch && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
