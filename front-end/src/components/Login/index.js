import React from 'react';
import styled from 'styled-components';
import { LeftPanel } from '../../shared/LeftPanel';
import { RightPanel } from '../../shared/RightPanel';
import * as LoginApi from '../../api/LoginApi';

class Login extends React.Component {
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

  onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state
    const res = await LoginApi.login(email, password);
    console.log(res);
  }

  render() {
    return (
      <LoginContainer>
        <LeftPanel message="Welcome back" />
        <RightPanel
          heading="Sign in to continue to GitHub Connector"
          onChange={this.handleChange}
          onSubmit={this.onSubmit}
          email={this.state.email}
          password={this.state.password}
          buttonText={"Login"}
        />
      </LoginContainer>
    )
  }
}

const LoginContainer = styled.div`
    display: flex;
  `;

export default Login;