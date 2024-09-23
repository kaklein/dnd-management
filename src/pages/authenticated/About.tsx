import AboutFooter from "@components/AboutFooter";
import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import Navbar from "@components/Navbar";
import ReleaseNote from "@components/ReleaseNote";
import { UserRole } from "@services/firestore/enum/UserRole";
import { useNavigate } from "react-router-dom";

interface Props {
  selectedPc?: {pcId: string | null, setSelectedPcId: (pcId: string) => void};
  userRole: UserRole | undefined;
}

function About ({selectedPc, userRole}: Props) {
  const navigate = useNavigate();
  
  return (
    <>
    <div className="main-body">
      <Navbar isSelectedPc={!!selectedPc} userRole={userRole}/>
      <PageHeaderBar 
          pageName="About"
      />

      <div>
        <Card>
          <div className="padding-20">
          <p className="dark-purple"><b>
            Never worry about forgetting your character sheet or calculating damage again!
          </b></p>
          <p>
            Start by creating your character and adding relevant items. Then you'll be able to:
            <ul>
              <li><b>Make easy skill checks</b> by referencing the Ability Scores page</li>
              <li><b>Track HP, spell slots, and more in real time</b> by updating the Tracker page</li>
              <li><b>Review spell and item descriptions</b> by referencing the Details page</li>
              <li><b>Level up your character</b> by making updates on the Overview page</li>
              <li><b>Add new weapons, spells, and more</b> on the Add Items page</li>
            </ul>
          </p>
          <Button
            buttonType={ButtonType.INFO}
            text="Let's get started!"
            onClick={
              () => navigate('/home')
            }
          />
          </div>
        </Card>

        <Card>
          <h4 className="section-header">Versions</h4>
            <h4 className="center">Current: {import.meta.env.PACKAGE_VERSION}</h4>
            <br/>
            <h5>Version History</h5>
            <div className="version-table container-fluid">
              <div className="row release-notes-header">
                <div className="col-2"><b>Version</b></div>
                <div className="col-2"><b>Release Date</b></div>
                <div className="col-8"><b>Release Notes</b></div>
              </div>
              <ReleaseNote version="1.1.0" releaseDate="2024-09-23"
              releaseNotes={
                <>
                  <p>Added tooltip info for attack and damage calculations, AC display on Tracker page, and About page.</p>                  
                  <p>Made UI improvements to Add Items page, Details page, and spell organization on Tracker page.</p>
                  <p>Minor bug fixes.</p>
                </>
              }
              />
              
              <ReleaseNote version="1.0.0" releaseDate="2024-09-09"/>
            </div>
        </Card>

        <Card>
          <h4 className="section-header">Report a Bug</h4>
          <p className="center">Having issues? Please fill out the Google form linked below.</p>
          <p className="center"><i>Note the current app version ({import.meta.env.PACKAGE_VERSION}) to include in your bug report.</i></p>          
          <Button
            buttonType={ButtonType.DANGER}
            text="Open Bug Report Form"
            onClick={
              ()=>window.open('https://forms.gle/KBrrrfjJRkdvWyEz8','_blank')
            }
          />
        </Card>

        <Card>
          <h4 className="section-header">Submit Feedback</h4>
          <p className="center">
            Let us know about your app experience! Fill out the Google survey linked below to provide feedback and make suggestions for improvements or new features.
          </p>
          <Button
            buttonType={ButtonType.DARK}
            text="Open Feedback Survey"
            onClick={
              ()=>window.open('https://forms.gle/QfPc3oYtRMP7ExNB9','_blank')
            }
          />
        </Card>
      </div>
    </div>
    <AboutFooter/>
    </>
  )
}

export default About;