import React from 'react';

import styled from 'styled-components';
import Logo from '../../svg/Logo';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";





class Dashboard extends React.Component {
    render() {
        return (
            <DashboardContainer>

                <LeftPanel>

                    <Logo fill="#FFFFFF" height="20%" />
                    <div>
                        Github Connector
                    </div>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                        <li>TEST-LINK</li>
                        <li>TEST-SIGNOUT</li>
                    </ul>

                </LeftPanel>
                <RightPanel>
                    <DashboardContentContainer>
                        <DashboardContentHeading>
                            Create your account
                        </DashboardContentHeading>
                        <DashboardContent>
                            <div>TEST - This color is only to show where there content box is...</div>
                            <div>TEST</div>
                            <div>TEST</div>
                            <div>TEST</div>
                        </DashboardContent>
                    </DashboardContentContainer>
                </RightPanel>
            </DashboardContainer>
        )
    }
}



const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: space-between;
  align-items: stretch;
`;

const LeftPanel = styled.div`
    display: flex;
    width: 15vw;
    align-items: center;
    flex-direction: column;
    background: #1A2E38;
    color: #fff;
    font-size: 16px;

`;


const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 100vh;
  
`;

const DashboardContentContainer = styled.div`

  background: #BBBBBB;
`;

const DashboardContentHeading = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #2C3A41;
  margin-bottom: 32px;
`;

const DashboardContent = styled.div`
   font-size: 24px;
   font-weight: 400;
   color: #2C3A41;
   margin-bottom: 32px;
`;



export default Dashboard;