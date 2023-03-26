import React, { useState} from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../Context/theme-context.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./lyrics.css";
import { useEffect } from "react";
import axios from 'axios'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

function Lyrics() {
    
    {/* trying react flask connection here if not work omit before return from here*/}
    
    const { theme } = useTheme();
    // const [lyrics, setLyrics] = useState("You're the light, you're the night");

     async function fetch_emoji(){

        // const result = await axios.post("http://127.0.0.1:5000/english/",{lyrics:"You're the light, you're the night"}) 
        // console.log(result.data)

        await fetch("http://127.0.0.1:5000/english/", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({lyrics:"You're the light, you're the night"}),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    
    }


            {/* trying other way here
                you have to add the result which is already here expressionlist.
            you have to add method and probability 
            call method, prediction and probability from flask
            make function identifyMood by clicking on which the output will be shown*/}
        {/*  const expressionResult = {
                happy: "Happy 😀",
                sad: "Sad 😔",
            }; */}

    return (
        <div className="p-16 flex flex-col gap-y-8 justify-evenly md:flex-row md:items-center">
            <div className="choice-container mx-auto w-4/5 md:w-2/6 p-4 rounded cursor-pointer">

            <h4 className="text-2xl font-medium">
                    Lyrics Detection <FontAwesomeIcon icon={faArrowRight} />
                </h4>
                <br />
                <textarea type="text" class="text-area" rows="10" columns="70"/>

                
            </div>
            <div className="choice-container mx-auto w-4/5 md:w-2/6 p-4 rounded cursor-pointer">

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

                    {/*<h4 className="text-center p-2 text-2xl underline">Output</h4>
						{results.length !== 0 && (
							<div className=" flex flex-col items-center justify-center mt-4">
								<span className="text-2xl font-bold my-12">
									{expressionResult[results]}
								</span>
                                <span className="text-2xl font-bold my-12">
									Probability: {expressionResult[prob]} %
                        </span> 
							</div>
                        )}*/}
            </div>
        </div>
    );
}

export { Lyrics };
