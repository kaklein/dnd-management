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
import { getUserRole } from '@services/firestore/getUserRole';
import { getAuth } from '@firebase/auth';
import VerifyEmail from '@pages/authenticated/VerifyEmail';

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
    const pcQuery = useQuery({
        queryKey: ['pcData', selectedPcId],
        queryFn: () => loadData(selectedPcId),
        enabled: !!loggedIn
    });

    /* Look up user role */
    const roleQuery = useQuery({
        queryKey: ['userRole'],
        queryFn: () => getUserRole(),
        enabled: !!loggedIn
    });

    /* Check if user has verified email */
    const verifiedUserQuery = useQuery({
        queryKey: ['isVerifiedUser'],
        queryFn: async () => {
            const auth = getAuth();
            if (auth.currentUser?.emailVerified) {
                return true;
            } else {
                await auth.currentUser?.reload();
                const verified = auth.currentUser?.emailVerified;
                if (verified) {
                    await auth.currentUser.getIdToken(true);
                }
                return verified;
            }
        },
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

    if (loggedIn && verifiedUserQuery.data == false) return <VerifyEmail/>

    if (loggedIn && (pcQuery.isLoading || roleQuery.isLoading || verifiedUserQuery.isLoading)) return <Loading/>

    if (pcQuery.error || !pcQuery.data || roleQuery.error || verifiedUserQuery.error) return (
        <Error 
            errorMessage="Error loading data"
            text="We're experiencing an issue loading your data. Try refreshing the page or logging out and back in, or come back another time."
        />
    )

    if (!pcQuery.data.selectedPcData) return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home pcList={pcQuery.data.pcList} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data}/>}/>
                <Route path="/home" element={<Home pcList={pcQuery.data.pcList} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data}/>}/>
                <Route path="/create" element={<CreateCharacter queryClient={queryClient} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data}/>}/>
            </Routes>
        </BrowserRouter>
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Overview pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data}/>}/>
                <Route path="/home" element={<Home pcList={pcQuery.data.pcList} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data}/>}/>
                <Route path="/overview" element={<Overview pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data}/>}/>
                <Route path="/stats" element={<Stats pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient} userRole={roleQuery.data}/>}/>
                <Route path="/tracker" element={<Tracker pcData={pcQuery.data.selectedPcData} queryClient={queryClient} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data}/>}/>
                <Route path="/details" element={<Details pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient} userRole={roleQuery.data}/>}/>
                <Route path="/update" element={<Update pcData={pcQuery.data.selectedPcData} queryClient={queryClient} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data}/>}/>
                <Route path="/create" element={<CreateCharacter queryClient={queryClient} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
