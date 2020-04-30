import React from 'react';
import styled from 'styled-components';
import SideBarNav from "../../shared/SideBarNav";
import jwt_decode from 'jwt-decode';
import axios from "axios";
import defaultUserImage from '../../svg/githubDefaultUserImage.png';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      github_info: [],
      isLoaded: false,
      hasLinkedGithub: false
    };
  }

  componentDidMount() {
    let token = localStorage.getItem('access_token');
    let decoded = jwt_decode(token);
    let userID = decoded.id;

    // TODO: Move API code to its own file under api folder
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://githubconnector.herokuapp.com';
    axios.get(`${url}/users/${userID}`,{ headers:{
      'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '  + token }
    }).then(
      (result) => {
        this.setState({
          isLoaded: true,
          id: result.data[0].id,
          email: result.data[0].email,
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

  handleHasGithub = () => {
    if(this.state.github_info === []){
      return <div>Welcome {this.state.email}</div>;
    }
    else{
      return <div> Welcome {this.state.github_info.github_username}</div>;
    }
  };


  render() {
    let {hasGH} = this.state.hasLinkedGithub;
    const renderWelcome = () =>{
      if (!hasGH) {
        return <div>Welcome {this.state.email}</div>;
      }
      else{
        return <div> Welcome {this.state.github_info.github_username}</div>;
      }

    }
    return (
      <DashboardContainer>
        <SideBarNav>
        </SideBarNav>
        <RightPanel>
          <DashboardContentContainer>
            <DashboardUserProfileImage>
              <img src={defaultUserImage} alt='defaultUserImage' height='150px' />
            </DashboardUserProfileImage>
            <DashboardUserContent>
              <DashboardContentHeading>
                {renderWelcome()}
              </DashboardContentHeading>
              <DashboardContent>
                <div>Dashboard Content</div>
                <div>Email: {this.state.email}</div>
              </DashboardContent>
            </DashboardUserContent>
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 100vh;
`;

const DashboardContentContainer = styled.div`
  display:flex;
  flex-direction: row;
  background: #BBBBBB;
`;

const DashboardUserProfileImage = styled.div`
  display:flex;
  padding: 25px 25px 25px 25px;
`;

const DashboardUserContent = styled.div`
  display:flex;
  flex-direction: column;
  padding: 25px 25px 25px 25px;
`;

const DashboardContentHeading = styled.div`
  font-size: 36px;
  font-weight: 400px;
  color: #2C3A41;
  margin-bottom: 32px;
`;

const DashboardContent = styled.div`
   font-size: 14px;
   font-weight: 400px;
   color: #2C3A41;
   margin-bottom: 32px;
`;

export default Dashboard;