import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { withRouter, Link } from "react-router-dom";
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

  handleFormSubmit = async (event) => {
    event.preventDefault();
    let payload = {
      "email": this.state.email,
      "password": this.state.password
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post('http://localhost:3000/users', payload, config);
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
            Already have an account?<Link to="/login">Click HERE</Link>
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
  padding: 40px;
`;


export default withRouter(Signup);
