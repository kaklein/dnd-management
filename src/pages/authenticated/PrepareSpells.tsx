import AboutFooter from "@components/AboutFooter";
import SuccessAlert from "@components/alerts/SuccessAlert";
import PageHeaderBarPC from "@components/headerBars/PageHeaderBarPC";
import Navbar from "@components/Navbar";
import QuickNav from "@components/QuickNav";
import { BaseDetails, PlayerCharacter } from "@models/playerCharacter/PlayerCharacter";
import { UserRole } from "@services/firestore/enum/UserRole";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PrepareSpellsList from "@components/PrepareSpellsList";
import Card from "@components/cards/Card";
import { useNavigate } from "react-router-dom";
import { SpellLevel } from "@models/playerCharacter/Spell";
import { SentryLogger } from "@services/sentry/logger";

interface Props {
    pcData: PlayerCharacter;
    pcList: BaseDetails[];
    selectedPc: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
    queryClient: QueryClient;
    userRole: UserRole | undefined;
    logger: SentryLogger;
}

function PrepareSpells({pcData, pcList, selectedPc, queryClient, userRole, logger}: Props) {   
    const navigate = useNavigate();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
    return (
        <>
        {showSuccessAlert && <SuccessAlert/>}

        <div className="main-body main-body-short">
            <Navbar isSelectedPc={!!selectedPc.pcId} userRole={userRole}/>

            <PageHeaderBarPC 
                pcName={`${pcData.baseDetails.name.firstName} ${pcData.baseDetails.name.lastName}`}
                pageName="Prepare Spells"
                pcList={pcList}
                selectedPc={selectedPc}
            />

            {/* PREPARE SPELLS CONTENT */}            
            <PrepareSpellsList
                pcData={pcData}
                queryClient={queryClient}
                setShowSuccessAlert={setShowSuccessAlert}
                logger={logger}
            />

            <Card customClass="large-top-margin light-gray-bg">
                <div>
                    <p className="inline update-form-description">
                        {
                            pcData.baseDetails.spells?.filter(s => s.level !== SpellLevel.CANTRIP).length == 0 &&
                            "No non-cantrip spells available to prepare! "
                        }
                        Need to add new spells instead?
                    </p>
                    <button type="button" className="btn btn-secondary inline" onClick={() => {
                        navigate('/add');
                        window.scrollTo(0, 0);
                    }}>
                        &#8663; Add Items
                    </button> 
                </div>                           
            </Card>

            <AboutFooter/>
        </div>
        <QuickNav/>
        </>
    )
}

export default PrepareSpells;