import Card from "@components/cards/Card";
import PageHeaderBar from "@components/PageHeaderBar";
import { createUser } from "@services/firebaseAuth/createUser";
import { sendVerification } from "@services/firebaseAuth/sendVerification";
import { setDisplayName } from "@services/firebaseAuth/setDisplayName";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      alert(`Passwords don't match! Please try again!!!`);
      return;
    }

    const createdUser = await createUser(formData.email, formData.passwordCreate);
    if (createdUser) {
      await Promise.all([
        setDisplayName(createdUser),
        sendVerification(createdUser)
      ]);
      navigate('/');
    } else {
      alert('Failed to create user :(');
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
        <p>Already have an account?</p>
        <a className="reroute-button" href="/login">Log In</a>
      </Card>
    </>
  )
}

export default SignUp;