// Source: https://loading.io/css/
import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingSpinner = ({ className }) => {
  return (
    <LoadingSpinnerContainer className={className}>
      <LoadingRing />
      <LoadingRing />
      <LoadingRing />
      <LoadingRing />
    </LoadingSpinnerContainer>
  );
}

const spinner = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinnerContainer = styled.div`
  display: block;
  position: relative;
  width: 80px;
  height: 80px;
`

const LoadingRing = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #a9a9a9;
  border-radius: 50%;
  animation: ${spinner} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #a9a9a9 transparent transparent transparent;
  &:nth-child(1) {
    animation-delay: -0.45s;
  }
  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  &:nth-child(3) {
    animation-delay: -0.15s;
  }
`

export default LoadingSpinner;
