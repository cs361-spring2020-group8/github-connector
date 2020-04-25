import React from 'react';
import styled from 'styled-components';
import SideBarNav from "../../shared/SideBarNav";
import jwt_decode from 'jwt-decode'




class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            created_at: '',
            id: '',
            email: '',
            password: '',
            isLoaded: false
        };
    }
        componentDidMount() {
            let token =  localStorage.getItem('access_token');
            let decoded = jwt_decode(token);
            console.log({decoded});
            return fetch("http://localhost:3000/users/" + decoded.id, {
                method: 'GET',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '  + token ,
                }

            })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result[0]);
                        this.setState({
                            isLoaded: true,
                            id: result[0].id,
                            email: result[0].email,
                            password: result[0].password,
                            created_at: result[0].created_at
                        });

                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )

        }



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
                            <div>UserID: {this.state.id}</div>
                            <div>Email: {this.state.email}</div>
                            <div>Password: {this.state.password} </div>
                            <div>Created: {this.state.created_at}</div>
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
   font-size: 14px;
   font-weight: 400;
   color: #2C3A41;
   margin-bottom: 32px;
`;



export default Dashboard;