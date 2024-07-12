import Card from "@components/cards/Card";
import { loginUser } from "@services/firebaseAuth/loginUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login () {
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
    console.log('Logging in...');
    if(!formData || !formData.email || !formData.password) {
      console.error(`No form data :(`);
      return;
    }
    const loggedIn = await loginUser(formData.email, formData.password);
    if(!loggedIn) {
      alert(`Dang it, we couldn't log you in :(`);
    }
    const navigate = useNavigate();
    navigate('/');
  }

  return (
    <>
      <h1 className="page-title">Log In</h1>
      <Card>
        <form  onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label" htmlFor="email-input">Email:</label>
            <input className="form-input" type="email" name="email" id="email" autoComplete="email" placeholder="dungeons@dragons.com" onChange={handleChange}/>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="password-input">Password:</label>
            <input className="form-input" type="password" name="password" id="password" autoComplete="current-password" placeholder="Password" onChange={handleChange}/>
          </div>
          <div>
            <button type="submit" className="btn btn-primary" id="login-submit-button">Log In</button>
          </div>
        </form>
        <hr/>
        <p>New user?</p>
        <a className="reroute-button" href="/signup">Sign Up</a>
      </Card>
    </>
  )
}

export default Login;