import React from 'react';
import styled from 'styled-components';
import FormInput from '../../shared/FormInput';
import Logo from '../../svg/Logo';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*phoneNumber: '',
      name: '',
      username: '',*/
      email: '',
      password: '',

    };
  }

  handleChange = (field, event) => {
    this.setState({
      [field]: event.target.value
    })
  }
  
  render() {
    return (
      <SignupContainer>
        <LeftPanel>
          <Logo fill="#FFFFFF" height="25%" />
          <div>
            Welcome to the Github Connector App
          </div>
        </LeftPanel>
        <RightPanel>
          <FormContainer>
            <FormHeading>
              Create your account
            </FormHeading>
            {/*<FormInput heading="Username" type="text" value={this.state.username} onChange={(event) => this.handleChange("username", event)} />
            <FormInput heading="Name" type="text" value={this.state.name} onChange={(event) => this.handleChange("name", event)} />
            <FormInput heading="Phone Number" type="tel" value={this.state.phoneNumber} onChange={(event) => this.handleChange("phoneNumber", event)} />*/}
            <FormInput heading="Email" type="email" value={this.state.email} onChange={(event) => this.handleChange("email", event)} />
            <FormInput heading="Password" type="password" value={this.state.password} onChange={(event) => this.handleChange("password", event)} />
            <SubmitButton type="submit" value="Create account"/>
          </FormContainer>
        </RightPanel>
      </SignupContainer>
    )
  }
}

const SignupContainer = styled.div`
  display: flex;
`;

const LeftPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 40vw;
  height: 100vh;
  background: #1A2E38;
  color: #fff;
  font-size: 16px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60vw;
`;

const FormContainer = styled.div`
  width: 30vw;
`;

const FormHeading = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #2C3A41;
  margin-bottom: 32px;
`;

const SubmitButton = styled.input`
  cursor: pointer;
  border: none;
  color: #FFFFFF;
  background: #7F337E;
  height 40px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 32px;
`;

export default Signup;