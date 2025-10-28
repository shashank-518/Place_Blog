import React  , {useEffect, useRef, useState}from "react";
import Button from "./Button";
import './imageUpload.css'


const ImageUpload = (props) =>{

    const [file, setFile] = useState();
    const [previewUrl , setpreviewUrl] = useState();
    const [isValid , setisValid] = useState(false)

    const filePicker = useRef()

    useEffect(()=>{
        if(!file){
            return;
        }

        const fileReader = new FileReader()
        fileReader.onload = ()=>{
            setpreviewUrl(fileReader.result)
        }

        fileReader.readAsDataURL(file)


    } , [file])



    const handleFile = (event)=>{
        let pickedfile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1){
            pickedfile = event.target.files[0]
            setFile(pickedfile)
            setisValid(true)
            fileIsValid = true;
        }
        else{
            setisValid(false)
            fileIsValid = false
        }
        props.onInput(props.id , pickedfile , fileIsValid)
    }

    const pickimageHandler = ()=>{
        filePicker.current.click()
    }

    return (
        <div className="form-control">
            <input 
                id= {props.id}
                ref={filePicker}
                type="file"
                style={{display:"none"}}
                accept=".jpg ,.jpeg ,.png" 
                onChange={handleFile}
            />

            <div className = {`image-upload ${props.center && 'center'} `}>

                <div className="image-upload__preview" >
                    {previewUrl && <img src= {previewUrl} alt="Preview"/>}
                    {!previewUrl && <p>Please pick an Image</p>}
                </div>

                <Button type ="button"  onClick = {pickimageHandler} >Pick Image</Button>

            </div>
            {!isValid && <p>{props.isValid}</p>}
        </div>
    )

}

export default ImageUpload;