import { useState, useEffect, useRef, useCallback } from "react";
import { LoaderAnimation } from "../../components/LoaderAnimation";
import { useTheme } from "../../Context/theme-context.js";
import * as faceapi from "face-api.js";
import "./audio.css";
import { useAlert } from "react-alert";
import { useSong } from "../../Context/songDataContext/song-context";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function Audio() {
  // const alert = useAlert();
  const { theme } = useTheme();
  // const [isModelLoading, setIsModelLoading] = useState(false);
  // const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState("");
  const [audioFile, setAudioFile] = useState();
  const fileInputRef = useRef();
  // const navigate = useNavigate();
  async function get_info() {
    const formData = new FormData();
    formData.append("audioFile", audioFile);
    // return formData;
    fetch("http://192.168.0.114:5000/test", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        // Handle any errors here
        console.log(error.message);
      });
  }

  // // when audio file is uploaded
  const uploadFile = (e) => {
    const { files } = e.target;
    // ??????????
    // console.log("Hello there");
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      //   console.log(url);
      setAudioFile(url);
    } else {
      //   setImageURL(null);
      console.log("No file");
    }
  };

  // when upload button is clicked
  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="App">
      <h1 className="header text-3xl text-center mb-4 font-bold">
        Audio Mood Prediction
      </h1>
      <div className="inputHolder px-32 py-8 flex flex-col gap-4 items-center justify-around md:flex-row">
        <div className="flex gap-4">
          <input
            type="file"
            // accept="wav/*"
            className="uploadInput"
            onChange={uploadFile}
            ref={fileInputRef}
          />
          <button
            className="uploadFile  btn-upload"
            onClick={triggerUpload}
            style={{
              backgroundColor: `${theme.mode.secondaryColor}`,
              color: `${theme.mode.bgColor}`,
            }}
          >
            <i className="fas fa-upload"></i>
          </button>
        </div>
      </div>
      <div className="mainWrapper">
        <div className="mainContent p-8">
          <div className="imageHolder p-4 border-box text-center">
            <h4 className="p-2 text-2xl underline">Preview</h4>
            {/* {audioFile && ( */}
            {/* <img
								// src={audioFile}
								// className="preview-img"
								// alt="Upload Preview"
								// crossOrigin="anonymous"
								// ref={imageRef}//audioref
							/> */}
            {/* )} */}
            {/* {imageURL && ( */}
            <button
              className="button btn-upload mt-2 mx-auto"
              onClick={get_info}
              style={{
                backgroundColor: `${theme.mode.secondaryColor}`,
                color: `${theme.mode.bgColor}`,
              }}
            >
              Identify Mood 🤔
            </button>
            {/* )} */}
          </div>
          <div className="resultsHolder p-4 border-box">
            <h4 className="text-center p-2 text-2xl underline">Output</h4>
            {/* {results.length !== 0 && ( */}
            <div className=" flex flex-col items-center justify-center mt-4">
              <span className="text-2xl font-bold my-12">
                {/*{expressionResult[results]} ````output from flask */}
              </span>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>

      {/* 	{isModelLoading && <LoaderAnimation />} */}
    </div>
  );
}

export { Audio };
