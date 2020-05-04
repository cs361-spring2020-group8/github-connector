import React from 'react';
import styled from 'styled-components';
import SideBarNav from '../../shared/SideBarNav';
import jwt_decode from 'jwt-decode'
import defaultUserImage from '../../svg/githubDefaultUserImage.png';
import * as DashboardApi from '../../api/DashboardApi';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      phone: '',
      twitter: '',
      github_info: {},
      isLoaded: false,
      hasAuthError: false,
      hasServerError: false
    };
  }

  componentDidMount() {
    let token = localStorage.getItem('access_token');
    let decoded = jwt_decode(token);
    let userID = decoded.id;

    this.setState({hasAuthError: false, hasServerError: false}, async () => {
      try {
        const res = await DashboardApi.pullUserInfo(userID, token);
        if (res.status === 200) {
            this.setState({
              isLoaded: true,
              id: res.data[0].id,
              email: res.data[0].email,
              twitter: res.data[0].twitter,
              phone: res.data[0].phone,
              github_info: res.data[0].github_info
            });
        }
      } catch (e) {
        const {response: {status}} = e
        if (status >= 400 && status < 500) {
          this.setState({hasAuthError: true});
        } else {
          this.setState({hasServerError: true});
        }
      }
    });
  }

  hasGH = () =>{
    if (this.state.github_info === null){
      return false;
    } else {
      return true;
    }
  }
  renderWelcome = () =>{
    if (this.hasGH) {
      return <div> Welcome {this.state.github_info.github_username}</div>;
    } else{
      return <div>Welcome {this.state.email}</div>;
    }
  }
  renderGHImage = () => {
    if(this.hasGH()){
      return <img src={this.state.github_info.profile_image_url} alt='userGHImage' height='150px'/>;
    } else {
      return null;
    }
  }


  render() {
    return (
      <DashboardContainer>
        <SideBarNav>
        </SideBarNav>
        <RightPanel>
          <DashboardContentContainer>
            <DashboardUserProfileImage>
              {this.renderGHImage()}
            </DashboardUserProfileImage>
            <DashboardUserContent>
              <DashboardContentHeading>
                {this.renderWelcome()}
              </DashboardContentHeading>
              <DashboardContent>
                <div>Dashboard Content</div>
                <div>Email: {this.state.email}</div>
                <div>Twitter: {this.state.twitter}</div>
                <div>GH Language: {this.state.github_info.language}</div>
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
  border-radius: 10px;
  overflow: hidden;
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