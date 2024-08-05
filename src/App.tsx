import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/authenticated/Overview";
import Stats from "./pages/authenticated/Stats";
import Tracker from "./pages/authenticated/Tracker";
import Details from "./pages/authenticated/Details";

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { loadData } from '@services/firestore/loadData';
import Login from '@pages/unauthenticated/Login';
import SignUp from '@pages/unauthenticated/SignUp';
import useFirebaseAuthentication from '@services/firebaseAuth/utils';
import Update from '@pages/authenticated/Update';
import PasswordReset from '@pages/unauthenticated/PasswordReset';
import Home from '@pages/authenticated/Home';
import { useLocalStorage } from '@services/localStorage/useLocalStorage';
import CreateCharacter from '@pages/authenticated/CreateCharacter';
import Loading from '@pages/Loading';
import Error from '@pages/Error';

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

    const [selectedPcId, setSelectedPcId] = useLocalStorage('selectedPcId');

    /* Load list of all displayable PCs */
    const { isLoading, error, data } = useQuery({
        queryKey: ['pcData', selectedPcId],
        queryFn: () => loadData(selectedPcId),
        enabled: !!loggedIn
    });

    if (!loggedIn) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/password-reset" element={<PasswordReset/>}/>
                </Routes>
            </BrowserRouter>
        )
    }

    if (loggedIn && isLoading) return (
        <Loading/>
    )

    if (error || !data) return (
        <Error 
            errorMessage="Error loading data"
            text="We're experiencing an issue loading your data. Try logging out and back in, or come back another time."
        />
    )

    if (!data.selectedPcData) return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home pcList={data.pcList} setSelectedPcId={setSelectedPcId}/>}/>
                <Route path="/home" element={<Home pcList={data.pcList} setSelectedPcId={setSelectedPcId}/>}/>
                <Route path="/create" element={<CreateCharacter queryClient={queryClient} setSelectedPcId={setSelectedPcId}/>}/>
            </Routes>
        </BrowserRouter>
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Overview pcData={data.selectedPcData} pcList={data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}}/>}/>
                <Route path="/home" element={<Home pcList={data.pcList} setSelectedPcId={setSelectedPcId}/>}/>
                <Route path="/overview" element={<Overview pcData={data.selectedPcData} pcList={data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}}/>}/>
                <Route path="/stats" element={<Stats pcData={data.selectedPcData} pcList={data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient}/>}/>
                <Route path="/tracker" element={<Tracker pcData={data.selectedPcData} queryClient={queryClient} pcList={data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}}/>}/>
                <Route path="/details" element={<Details pcData={data.selectedPcData} pcList={data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient}/>}/>
                <Route path="/update" element={<Update pcData={data.selectedPcData} queryClient={queryClient} pcList={data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}}/>}/>
                <Route path="/create" element={<CreateCharacter queryClient={queryClient} setSelectedPcId={setSelectedPcId}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
