import * as Sentry from "@sentry/react";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/authenticated/Overview";
import Stats from "./pages/authenticated/Stats";
import Tracker from "./pages/authenticated/Tracker";
import Details from "./pages/authenticated/Details";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getImageUrl, loadData } from '@services/firestore/loadData';
import Login from '@pages/unauthenticated/Login';
import SignUp from '@pages/unauthenticated/SignUp';
import useFirebaseAuthentication from '@services/firebaseAuth/utils';
import AddItems from '@pages/authenticated/AddItems';
import PasswordReset from '@pages/unauthenticated/PasswordReset';
import Home from '@pages/authenticated/Home';
import { useLocalStorage } from '@services/localStorage/useLocalStorage';
import CreateCharacter from '@pages/authenticated/CreateCharacter';
import Loading from '@pages/Loading';
import Error from '@pages/Error';
import { getUserRole } from '@services/firestore/getUserRole';
import { getAuth } from '@firebase/auth';
import VerifyEmail from '@pages/authenticated/VerifyEmail';
import About from '@pages/authenticated/About';
import PrepareSpells from '@pages/authenticated/PrepareSpells';
import { SentryLogger } from "@services/sentry/logger";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const getMillis = (minutes: number) => {
    return minutes * 60000;
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
                <MainApp/>
            </Sentry.ErrorBoundary>
        </QueryClientProvider>

    )
}

function MainApp() {
    /* Check for user and redirect if needed */
    const loggedIn = useFirebaseAuthentication();

    const [selectedPcId, setSelectedPcId] = useLocalStorage('selectedPcId');

    /* Load list of all displayable PCs */
    const pcQuery = useQuery({
        queryKey: ['pcData', selectedPcId],
        queryFn: () => loadData(selectedPcId),
        enabled: !!loggedIn,
        refetchOnWindowFocus: false,
        staleTime: getMillis(30)
    });

    /* Load PC image, if available */
    const imageQuery = useQuery({
        queryKey: ['imageUrl', pcQuery.data?.selectedPcData?.baseDetails.imagePath],
        queryFn: () => getImageUrl(pcQuery.data?.selectedPcData?.baseDetails.imagePath ?? '', pcQuery.data?.selectedPcData?.baseDetails.pcId ?? ''),
        enabled: !!loggedIn,
        refetchOnWindowFocus: false,
        staleTime: getMillis(120)
    });

    /* Look up user role */
    const roleQuery = useQuery({
        queryKey: ['userRole'],
        queryFn: () => getUserRole(),
        enabled: !!loggedIn,
        refetchOnWindowFocus: false,
        staleTime: getMillis(30)
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
        enabled: !!loggedIn,
    });

    /* Initialize logger */
    const [sentryLogger, setSentryLogger] = useState(new SentryLogger(getAuth().currentUser?.uid, pcQuery.data?.selectedPcData?.baseDetails.pcId, JSON.stringify(pcQuery.data?.selectedPcData?.baseDetails.name)));
    useEffect(() => {
        setSentryLogger(new SentryLogger(getAuth().currentUser?.uid ?? '', selectedPcId ?? '', JSON.stringify(pcQuery.data?.selectedPcData?.baseDetails.name)));
    }, [selectedPcId]);

    if (!loggedIn) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Login logger={sentryLogger}/>}/>
                    <Route path="/login" element={<Login logger={sentryLogger}/>}/>
                    <Route path="/signup" element={<SignUp logger={sentryLogger}/>}/>
                    <Route path="/password-reset" element={<PasswordReset logger={sentryLogger}/>}/>
                </Routes>
            </BrowserRouter>
        )
    }

    if (loggedIn && verifiedUserQuery.data == false) return <VerifyEmail queryClient={queryClient}/>

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
                <Route path="/create" element={<CreateCharacter queryClient={queryClient} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path ="/about" element={<About userRole={roleQuery.data}/>}/>
            </Routes>
        </BrowserRouter>
    )

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Overview pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} imageUrl={imageQuery.data ?? ''} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data} queryClient={queryClient} logger={sentryLogger}/>}/>
                <Route path="/home" element={<Home pcList={pcQuery.data.pcList} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data}/>}/>
                <Route path="/overview" element={<Overview pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} imageUrl={imageQuery.data ?? ''} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data} queryClient={queryClient} logger={sentryLogger}/>}/>
                <Route path="/stats" element={<Stats pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path="/tracker" element={<Tracker pcData={pcQuery.data.selectedPcData} queryClient={queryClient} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path="/details" element={<Details pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path="/prepare-spells" element={<PrepareSpells pcData={pcQuery.data.selectedPcData} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} queryClient={queryClient} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path="/add" element={<AddItems pcData={pcQuery.data.selectedPcData} queryClient={queryClient} pcList={pcQuery.data.pcList} selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path="/create" element={<CreateCharacter queryClient={queryClient} setSelectedPcId={setSelectedPcId} userRole={roleQuery.data} logger={sentryLogger}/>}/>
                <Route path ="/about" element={<About selectedPc={{pcId: selectedPcId, setSelectedPcId: setSelectedPcId}} userRole={roleQuery.data}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
