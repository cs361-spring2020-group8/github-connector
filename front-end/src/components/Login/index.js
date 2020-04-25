import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { LeftPanel } from '../../shared/LeftPanel';
import { RightPanel } from '../../shared/RightPanel';
import * as LoginApi from '../../api/LoginApi';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      hasAuthError: false,
      hasServerError: false,
    };
  }

  handleChange = (field, event) => {
    this.setState({
      [field]: event.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state
    this.setState({ hasAuthError: false, hasServerError: false }, async () => {
      try {
        const res = await LoginApi.login(email, password);
        if (res.status === 200) {
          localStorage.removeItem('access_token');
          localStorage.setItem('access_token', res.data.token)
          this.props.history.push('/dashboard');
        }
      } catch (e) {
        const { response: { status } } = e
        if (status >= 400 && status < 500) {
          this.setState({ hasAuthError: true });
        } else {
          this.setState({ hasServerError: true });
        }
      }
    });
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
          hasAuthError={this.state.hasAuthError}
          hasServerError={this.state.hasServerError}
        />
      </LoginContainer>
    )
  }
}

const LoginContainer = styled.div`
  display: flex;
`;

export default withRouter(Login);