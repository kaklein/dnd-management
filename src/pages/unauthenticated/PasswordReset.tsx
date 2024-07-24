import Alert from "@components/Alert";
import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import { resetPassword } from "@services/firebaseAuth/resetPassword";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PasswordReset () {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await resetPassword(email);
    } catch (e) {
      console.error(`Error resetting password: ${e}`);
      alert('Error occurred sending password reset email. Please refresh the page and try again.');
      return;
    }
    setShowConfirmation(true);
    triggerSuccessAlert();
  }

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const triggerSuccessAlert = () => {
      setShowSuccessAlert(true);
      setTimeout(() => {
          setShowSuccessAlert(false);
      }, 2000);
  };
  
  return (
    <>
      <PageHeaderBar 
          pageName="Reset Password"
      />
      
      <Card>
        <div>
          <p className="center">Enter your email and click the Reset Password button.</p>
          <p className="center">If a user exists with that email address, we will email you a link to reset your password.</p>
          <form  onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label className="form-label" htmlFor="email-input">Email:</label>
              <input
                className="form-input"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="dungeons@dragons.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <Button
                text="Reset Password"
                buttonType={ButtonType.PRIMARY}
                type="submit"
                onClick={() => {}}
              />
              {showSuccessAlert && <Alert alertText="" className="successful-alert" iconFile="/images/icons/success-icon.png"/>}
            </div>
          </form>
        </div>

        {
          showConfirmation &&
          <div>
            <p>Please check your email and follow the instructions to reset your password.</p>
          </div>
        }

        <hr/>
        <div className="button-menu">
          <Button
            text="Log In"
            buttonType={ButtonType.SECONDARY}
            onClick={() => navigate('/login')}
          />
          <Button
            text="Sign Up"
            buttonType={ButtonType.SECONDARY}
            onClick={() => navigate('/signup')}
          />
        </div>
      </Card>
    </>
  )
}

export default PasswordReset;