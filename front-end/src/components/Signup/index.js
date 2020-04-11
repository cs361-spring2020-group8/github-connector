import React from 'react';
import styled from 'styled-components';

class Signup extends React.Component {
  render() {
    return (
      <SignupContainer>
        <LeftPanel>
          <div>
            Welcome to the Github Connector App
          </div>
        </LeftPanel>
        <Form>
          <FormHeading>
            Create your account
          </FormHeading>
        </Form>
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
  width: 40vw;
  height: 100vh;
  background: #1a2e38;
  color: #fff;
  font-size: 16px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  color: #000;
  width: 60vw;
`;

const FormHeading = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #2c3a41;
`;

export default Signup;