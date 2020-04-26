import React from 'react';
import styled from 'styled-components';
import Logo from '../svg/Logo';

/**
 * Used in the login and signup pages
 * @param props - Currently only expects message that is used for display
 */
export const LeftPanel = (props) => (
  <LeftPanelContainer>
    <Logo fill="#FFFFFF" height="25%" />
    <div>
      {props.message}
    </div>
  </LeftPanelContainer>
)

const LeftPanelContainer = styled.div`
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