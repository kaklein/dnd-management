import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Tracker from "./pages/Tracker";
import Details from "./pages/Details";

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { loadData } from '@services/firestore/loadData';
import Card from '@components/cards/Card';
import Login from '@pages/Login';
import SignUp from '@pages/SignUp';
import useFirebaseAuthentication from '@services/firebaseAuth/utils';
import Update from '@pages/Update';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <MainApp/>
        </QueryClientProvider>

    )
}

function MainApp() {
    // /* Check for user and redirect if needed */
    const loggedIn = useFirebaseAuthentication();
    
    /* Load data before displaying pages */
    const { isLoading, error, data } = useQuery({
        queryKey: ['pcData', loggedIn],
        queryFn: loadData,
        enabled: !!loggedIn
    });

    if (!loggedIn) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                </Routes>
            </BrowserRouter>
        )
    }

    if (loggedIn && isLoading) return (
        <>
            <Card>
                <h3>Loading...</h3>
            </Card>
        </>
    )

    if (error) return (
        <>
            <Card>
                <h3>Error loading data: {error.message}</h3>
            </Card>
        </>
    )
    
    if (!data) return (
        <>
            <Card>
                <h3>No data found :(</h3>
            </Card>
        </>
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home pcData={data}/>}/>
                <Route path="/home" element={<Home pcData={data}/>}/>
                <Route path="/stats" element={<Stats pcData={data}/>}/>
                <Route path="/tracker" element={<Tracker pcData={data} queryClient={queryClient}/>}/>
                <Route path="/details" element={<Details pcData={data}/>}/>
                <Route path="/update" element={<Update pcData={data} queryClient={queryClient}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
