import React from 'react';
import styled, { keyframes } from 'styled-components';
import logo from '../../logo.svg';

// TODO: Remove boilerplate in place of real home page
// once we decide what that should look like
function Home() {
  return (
    <Header>
      <Logo src={logo} alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
      <AppLink
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
        </AppLink>
    </Header>
  );
}

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Logo = styled.img`
  height: 40vmin;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} infinite 20s linear;
  }
`;

const AppLink = styled.a`
  color: #61dafb;
`;

export default Home;