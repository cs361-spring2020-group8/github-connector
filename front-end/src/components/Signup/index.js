import React from 'react';
import styled from 'styled-components';
import FormInput from '../../shared/FormInput';
import Logo from '../../svg/Logo';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
    };
  }

  handleChange = (event) => {
    console.log(event.target.value);
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
            <FormInput heading="Username" type="text" value={this.state.username} onChange={this.handleChange} />
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