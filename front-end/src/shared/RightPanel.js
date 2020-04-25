import React from 'react';
import styled from 'styled-components';
import FormInput from './FormInput';

export const RightPanel = (props) => (
  <RightPanelContainer>
    <FormContainer>
      <FormHeading>
        {props.heading}
      </FormHeading>
      <FormInput heading="Email" type="email" value={props.email} onChange={(event) => props.onChange("email", event)} />
      <FormInput heading="Password" type="password" value={props.password} onChange={(event) => props.onChange("password", event)} />
      <SubmitButton type="submit" value={props.buttonText} />
    </FormContainer>
  </RightPanelContainer>
);

const RightPanelContainer = styled.div`
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