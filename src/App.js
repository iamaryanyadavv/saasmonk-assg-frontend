import './App.css';
import MoviesPage from './pages/movies/moviesPage';
import { Route, Routes } from 'react-router-dom';
import { createTheme, NextUIProvider } from "@nextui-org/react"

function App() {
    const theme = createTheme({
        type: 'light',
        theme: {
            colors: {
                white: '#ffffff',
                black: '#000000',
            }
        }
    })


    return (
        <>
            <NextUIProvider theme={theme}>
                <Routes>
                    <Route exact path='/' element={<MoviesPage />} />
                </Routes>
            </NextUIProvider>
        </>
    );
}

export default App;
