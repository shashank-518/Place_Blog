import  { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
    switch (action.type) {
      case "INPUT_CHANGE":
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if(!state.inputs[inputId]){
            continue;
          }
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid },
          },
          isValid: formIsValid,
        };
      case "SET_DATA":
        return{
          inputs: action.inputData,
          isValid: action.formData
        }
        
      default:
        return state;
    }
  };


export const useForm = (intialinput , intialvalid)=>{
      const [formState, dispatch] = useReducer(formReducer, {
        inputs: intialinput,
        isValid: intialvalid,
      });


      const setData = useCallback((inputs , formvalidity)=>{
        dispatch({
          type: "SET_DATA",
          inputData: inputs,
          formData: formvalidity 
        })
      },[])

    
      const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
          type: "INPUT_CHANGE",
          value: value,
          isValid: isValid,
          inputId: id,
        });
      }, []);

      return [formState,inputHandler , setData]
      
}
