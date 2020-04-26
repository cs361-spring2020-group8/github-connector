import React from 'react';
import styled from 'styled-components';
import { LeftPanel } from '../../shared/LeftPanel';
import { RightPanel } from '../../shared/RightPanel';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        <LeftPanel message="Welcome to the Github Connector App"/>
        <RightPanel
          heading="Create your account"
          onChange={this.handleChange}
          email={this.state.email}
          password={this.state.password}
          buttonText="Create Account"
        />
      </SignupContainer>
    )
  }
}

const SignupContainer = styled.div`
  display: flex;
`;

export default Signup;