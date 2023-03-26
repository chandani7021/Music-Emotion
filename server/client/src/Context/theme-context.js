import { createContext, useContext, useState } from "react";

const light = {
    bgColor: "#f2f6f7",
    primaryColor: "#353538",
    secondaryColor: "#4470b8",
    shadowColor: "#284d8a"
}
const dark = {
    bgColor: "#353538",
    primaryColor: "#f2f6f7",
    secondaryColor: "#f5f2f3",
    shadowColor: "#595B83"
}
const ThemeContext = createContext({mode: light, isLight: true});
const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState({mode: light, isLight: true});
    const themeHandler = () => {
        theme.isLight ? setTheme({mode: dark, isLight: false}) : 
        setTheme({mode: light, isLight: true});
    }
    return (
        <ThemeContext.Provider value={{theme, themeHandler}}>
            {children}
        </ThemeContext.Provider>
    );
}

const useTheme = () => useContext(ThemeContext);

export {useTheme, ThemeProvider}