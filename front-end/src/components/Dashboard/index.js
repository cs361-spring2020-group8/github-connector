import React from 'react';
import styled from 'styled-components';
import Logo from '../../svg/Logo';
//import FormInput from "../../shared/FormInput";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <DashboardContainer>
                <LeftPanel>
                    <LogoBox>
                        <Logo fill="#FFFFFF" height="100%" />
                        <div>
                            Github Connector
                        </div>
                    </LogoBox>
                    <NavPanel>
                        <div>TEST-PROFILE</div>
                        <div>TEST-FRIENDS</div>
                        <div>TEST-???</div>
                        <div>TEST-LINK</div>
                        <div>TEST-SIGNOUT</div>
                        <div>I envision these <br/>
                            having space between<br/>
                            them when they<br/>
                            become links</div>
                    </NavPanel>
                    <FooterPanel></FooterPanel>
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
`;

const LeftPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 15vw;
    height: 100vh;
    background: #1A2E38;
    color: #fff;
    font-size: 16px;
`;

const LogoBox = styled.div`
    
    display: flex;
    margin-top: 5vh;
    align-items: center;
    justify-content: start;
    flex-direction: column;
    margin-bottom: 12px;
`;

const NavPanel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    background: #1A2E38;
    color: #fff;
    font-size: 16px;
    margin: 10px;
    
`;


const FooterPanel = styled.div`
    display: flex;
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
  width: 70vw;
  height: 60vh;

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