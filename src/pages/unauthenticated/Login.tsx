import Button, { ButtonType } from "@components/Button";
import Card from "@components/cards/Card";
import PageHeaderBar from "@components/headerBars/PageHeaderBar";
import { loginUser } from "@services/firebaseAuth/loginUser";
import { SentryLogger } from "@services/sentry/logger";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  logger: SentryLogger;
}

function Login ({logger}: Props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData: any) => ({...prevFormData, [name]: value}));
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if(!formData || !formData.email || !formData.password) {
      console.error(`No form data :(`);
      return;
    }
    await loginUser(formData.email, formData.password, logger);
    navigate('/');
  }

  return (
    <>
      <PageHeaderBar 
          pageName="Log In"
          showLogo={true}
      />
      <Card>
        <form  onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label" htmlFor="email-input">Email:</label>
            <input className="form-input" type="email" name="email" id="email" autoComplete="email" placeholder="dungeons@dragons.com" onChange={handleChange} autoFocus/>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="password-input">Password:</label>
            <input className="form-input" type="password" name="password" id="password" autoComplete="current-password" placeholder="Password" onChange={handleChange}/>
          </div>
          <div>
            <Button
              text="Log In"
              buttonType={ButtonType.PRIMARY}
              type="submit"
              onClick={() => {}}
            />  
          </div>
        </form>
        <hr/>
        <div className="button-menu">
          <p>New user?</p>
          <Button
            text="Sign Up"
            buttonType={ButtonType.SECONDARY}
            onClick={() => {navigate('/signup')}}
          />
          <br/><br/>
          <p>Forgot password?</p>
          <Button
            text="Reset Password"
            buttonType={ButtonType.SECONDARY}
            onClick={() => {navigate('/password-reset')}}
          />
        </div>

      </Card>
    </>
  )
}

export default Login;