import React from 'react';
import styled from 'styled-components';
import SideBarNav from "../../shared/SideBarNav";


class Dashboard extends React.Component {
    render() {
        return (
            <DashboardContainer>

                <SideBarNav>
                </SideBarNav>
                <RightPanel>
                    <DashboardContentContainer>
                        <DashboardContentHeading>
                            Dashboard Content Header
                        </DashboardContentHeading>
                        <DashboardContent>
                            <div>Dashboard Content</div>
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
  font-size: 36px;
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