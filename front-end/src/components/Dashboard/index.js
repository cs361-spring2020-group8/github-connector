import React from 'react';
import styled from 'styled-components';
import Logo from '../../svg/Logo';
import FormInput from "../../shared/FormInput";

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
                    </NavPanel>
                </LeftPanel>
                <RightPanel>
                    <DashboardContentContainer>
                        <FormHeading>
                            Create your account
                        </FormHeading>
                        <FormContent>
                            <div>TEST</div>
                            <div>TEST</div>
                            <div>TEST</div>
                            <div>TEST</div>
                        </FormContent>
                    </DashboardContentContainer>
                </RightPanel>
            </DashboardContainer>
        )
    }
}

const DashboardContainer = styled.div`
  display: flex;
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
    justify-content: space-around;
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
  height: 80vw;
  
`;

const DashboardContentContainer = styled.div`
  width: 70vw;
  height: 60vw;

  background: #BBBBBB;
`;

const FormHeading = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #2C3A41;
  margin-bottom: 32px;
`;

const FormContent = styled.div`
   font-size: 24px;
   font-weight: 400;
   color: #2C3A41;
   margin-bottom: 32px;
`;



export default Dashboard;