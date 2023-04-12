import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/theme-context";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { SongProvider } from "./Context/songDataContext/song-context";
import axios from "axios";

const options = {
	position: positions.BOTTOM_CENTER,
	timeout: 4000,
	offset: "30px",
	transition: transitions.SCALE,
};

axios.defaults.baseURL = "http://127.0.0.1:5000"
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider>
				<SongProvider>
					<AlertProvider template={AlertTemplate} {...options}>
						<App />
					</AlertProvider>
				</SongProvider>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
