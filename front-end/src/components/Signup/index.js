import React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from "react-router-dom";
import { LeftPanel } from '../../shared/LeftPanel';
import { RightPanel } from '../../shared/RightPanel';
import * as SignupApi from '../../api/SignupApi';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = this.state
      const res = await SignupApi.signup(email, password);
      if (res.status === 200) {
        localStorage.removeItem('access_token');
        localStorage.setItem('access_token', res.data.token);
        this.props.history.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }

  }

  handleChange = (field, event) => {
    this.setState({
      [field]: event.target.value
    })
  }

  render() {
    return (
      <SignupContainer>
        <LeftPanel message="Welcome to the Github Connector App" />
        <RightPanel
          heading="Create your account"
          onChange={this.handleChange}
          onSubmit={this.handleFormSubmit}
          email={this.state.email}
          password={this.state.password}
          buttonText="Create Account"
        >
          <SignInText>
            Already have an account? <Link to="/login">Click HERE</Link>
          </SignInText>
        </RightPanel>
      </SignupContainer>
    )
  }
}

const SignupContainer = styled.div`
  display: flex;
`;

const SignInText = styled.div`
  font-size: 11px;
  text-align: center;
  padding-top: 32px;
`;


export default withRouter(Signup);
