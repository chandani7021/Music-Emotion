import { useState, useEffect, useRef, useCallback } from "react";
import { LoaderAnimation } from "../../components/LoaderAnimation";
import { useTheme } from "../../Context/theme-context.js";
import * as faceapi from "face-api.js";
import "./audio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

function Audio() {
  // const alert = useAlert();
  const { theme } = useTheme();
  // const [isModelLoading, setIsModelLoading] = useState(false);
  // const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState(null);
  const [audioFile, setAudioFile] = useState();
  const fileInputRef = useRef();
  // const navigate = useNavigate();

  async function get_info() {
    const formData = new FormData();
    formData.append("audioFile", audioFile);
    // return formData;
    try {
      const resp = await axios.post("/audio-predict", formData);
      console.log(resp.data);
      setResults(resp.data);
    } catch (e) {
      throw console.log(e);
    }
  }

  // // when audio file is uploaded
  const uploadFile = (e) => {
    const { files } = e.target;
    // ??????????
    // console.log("Hello there");
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      //   console.log(url);
      setAudioFile(files[0]);
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
          <div className="imageHolder flex flex-col p-4 border-box text-center">
            <h4 className="text-2xl font-medium">
              Detect Mood of Audio <FontAwesomeIcon icon={faArrowRight} />
            </h4>
            <button
              className="center button btn-upload mt-4"
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

            <div className=" flex flex-col items-center justify-center mt-4">
              <div
                className="text-2xl font-bold my-12"
                style={{
                  color: "#0f0f0f",
                  fontSize: 20,
                }}
              >
                {results}
              </div>
              {/* <p style={{ color: "#000" }}></p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Audio };
