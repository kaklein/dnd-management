import Card from "@components/cards/Card";
import PageHeaderBar from "@components/PageHeaderBar";
import { User } from "@firebase/auth";
import { createUser } from "@services/firebaseAuth/createUser";
import { sendVerification } from "@services/firebaseAuth/sendVerification";
import { setDisplayName } from "@services/firebaseAuth/setDisplayName";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const USER_EXISTS_SIGNUP_ERROR = 'auth/email-already-in-use';
const WEAK_PASSWORD_SIGNUP_ERROR = 'auth/weak-password';

function SignUp () {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    passwordCreate: '',
    passwordConfirm: ''
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData: any) => ({...prevFormData, [name]: value}));
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log('Signing up...');
    if(!formData || !formData.email || !formData.passwordCreate || !formData.passwordConfirm) {
      console.error(`No form data :(`);
      return;
    }
    if(formData.passwordCreate !== formData.passwordConfirm) {
      alert(`Passwords do not match.`);
      return;
    }

    const createResult: {success: boolean, error: any, user: User | undefined} = await createUser(formData.email, formData.passwordCreate);
    if (createResult.success && createResult.user) {
      await Promise.all([
        setDisplayName(createResult.user),
        sendVerification(createResult.user)
      ]);
      navigate('/');
    } else if (!createResult.success && createResult.error.errorCode === USER_EXISTS_SIGNUP_ERROR) {
      alert(`User with email address ${formData.email} already exists. Please log in or reset your password.`);
    } else if (!createResult.success && createResult.error.errorCode === WEAK_PASSWORD_SIGNUP_ERROR) {
      alert(`Password should be at least 6 characters.`);
    } else {
      alert('Failed to create user. Please refresh the page and try again.');
    }
  }

  return (
    <>
      <PageHeaderBar 
        pageName="Sign Up"
      />
      <Card>
        <form  onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label" htmlFor="email-input">Email:</label>
            <input className="form-input" type="email" name="email" id="email" autoComplete="email" placeholder="dungeons@dragons.com" onChange={handleChange}/>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="password-input">Password:</label>
            <input className="form-input" type="password" name="passwordCreate" id="passwordCreate" autoComplete="new-password" placeholder="Password" onChange={handleChange}/>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="password-input">Confirm Password:</label>
            <input className="form-input" type="password" name="passwordConfirm" id="passwordConfirm" autoComplete="new-password" placeholder="Password" onChange={handleChange}/>
          </div>
          <div>
            <button type="submit" className="btn btn-primary" id="login-submit-button">Sign Up</button>
          </div>
        </form>
        <hr/>
        <div>
          <p>Already have an account?</p>
          <a className="reroute-button" href="/login">Log In</a> or <a className="reset-password-button" href="/password-reset">Reset Password</a>
        </div>        
      </Card>
    </>
  )
}

export default SignUp;