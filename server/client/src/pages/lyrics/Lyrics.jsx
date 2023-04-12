import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../Context/theme-context.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./lyrics.css";
import { useEffect } from "react";
import axios from "axios";

function Lyrics() {
  {
    /* trying react flask connection here if not work omit before return from here*/
  }

  const { theme } = useTheme();
  const [lyrics, setLyrics] = useState("You're the light, you're the night");
  let expressionResult = ["Happy 😀", "Sad 😔"];

  const [percent, setPercent] = useState(null);
  const [emoji, setEmoji] = useState(null);
  async function fetch_emoji() {
    // const result = await axios.post("http://127.0.0.1:5000/english/",{lyrics:"You're the light, you're the night"})
    // console.log(result.data)

    try {
      const resp = await axios.post("/english", { lyrics });
      // console.log(resp.data);
      setPercent(resp.data[1]);
      let num = parseInt(resp.data[0][1]);
      // console.log(num);
      setEmoji(num);
      // console.log(resp.data[0][1]);
      // console.log(emoji);
    } catch (e) {
      throw console.log(e);
    }
  }

  return (
    <div className="App">
      <h1 className="header text-3xl text-center mb-4 font-bold">
        Lyrics Mood Prediction
      </h1>

      <div className="p-16 flex flex-col gap-y-8 justify-evenly md:flex-row md:items-center">
        <div className="choice-container mx-auto w-4/5 md:w-2/6 p-4 rounded cursor-pointer">
          <h4 className="text-2xl font-medium">
            Lyrics Detection <FontAwesomeIcon icon={faArrowRight} />
          </h4>
          <br />
          <textarea
            type="text"
            className="text-area"
            rows="10"
            columns="70"
            onInput={(e) => {
              setLyrics(e.target.value);
            }}
          />
        </div>
        <div className="choice-container mx-auto w-4/5 md:w-2/6 p-4 rounded cursor-pointer">
          <div className=" flex flex-col items-center justify-center mt-4">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <br />
              <div
                style={{
                  color: "#f2f6f7",
                  fontSize: 20,
                }}
              >
                {expressionResult[emoji]}
              </div>
              <br />
              <div
                style={{
                  color: "#f2f6f7",
                  fontSize: 20,
                }}
              >
                {percent}
              </div>
            </div>
            <br />
            <button
              className="button btn-upload mt-2 mx-auto"
              onClick={fetch_emoji}
              style={{
                backgroundColor: `${theme.mode.secondaryColor}`,
                color: `${theme.mode.bgColor}`,
              }}
            >
              Identify Mood 🤔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Lyrics };
