import React from 'react';
import styled from 'styled-components';
import SideBarNav from '../../shared/SideBarNav';
import jwt_decode from 'jwt-decode'
import * as DashboardApi from '../../api/DashboardApi';
import { Link } from "react-router-dom";


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      phone: '',
      twitter: '',
      github_info: null,
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


  hasGithubInfo = () =>{
    return this.state.github_info !== null;
  }

  renderWelcome = () =>{
    const welcomeName = this.hasGithubInfo() ? this.state.github_info.github_username : this.state.email;
    return <div>Welcome {welcomeName}</div>
  }

  renderGitHubImage = () => {
    if(this.hasGithubInfo()){
      return <img src={this.state.github_info.profile_image_url} alt='userGHImage' height='150px'/>;
    } else {
      return null;
    }
  }

  renderLanguage = () => {
    const githubLanguage = this.state.github_info.language || 'None Listed';
    return <div>Github Language: {githubLanguage}</div>;
  }

  renderDashboardContent = () => {
    return <>
      <div>Profile Information:</div>
      <br/>
      <div>Email: {this.state.email}</div>
      {!!this.state.phone && <div>Phone: {this.state.phone}</div>}
      {!!this.state.twitter && <div>Twitter: {this.state.twitter}</div>}
      {this.hasGithubInfo() &&
      <>
        <div>Github Page: <a href={"https://github.com/" + this.state.github_info.github_username}>
          {this.state.github_info.github_username}</a></div>
        {this.renderLanguage()}
      </>
      }
    </>;
  }

  renderEditProfileLink = () => {
    if(this.hasGithubInfo()){
      return <>
        <div> <Link to='/editprofile'>Click Here To Edit Profile</Link> </div>
      </>
    }else{
      return <>
        <div>Our app works best when you link your GitHub account.</div>
        <br/>
        <div> <Link to='/editprofile'>Click Here To Link Your GitHub Account And Edit Profile</Link> </div>
      </>
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
                {this.renderGitHubImage()}
              </DashboardUserProfileImage>
              <DashboardUserContent>
                <DashboardContentHeading>
                  {this.renderWelcome()}
                </DashboardContentHeading>
                <DashboardContent>
                  {this.renderDashboardContent()}
                </DashboardContent>
                <EditProfileLinkContainer>
                  {this.renderEditProfileLink()}
                </EditProfileLinkContainer>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 100vh;
`;

const DashboardContentContainer = styled.div`
  display:flex;
  flex-direction: row;
  background: #e5e5e5;
  border-radius: 10px;
  overflow: hidden;
`;

const DashboardUserProfileImage = styled.div`
  display:flex;
  padding: 25px 25px 25px 25px;
`;

const DashboardContent = styled.div`
   font-size: 16px;
   font-weight: 400;
   color: #2C3A41;
   margin-bottom: 32px;
`;

const DashboardContentHeading = styled.div`
  font-size: 36px;
  font-weight: 400;
  color: #2C3A41;
  margin-bottom: 32px;
`;

const DashboardUserContent = styled.div`
  display:flex;
  flex-direction: column;
  padding: 25px 25px 25px 25px;
`;

const EditProfileLinkContainer = styled.div`
   display: flex;
   flex-direction: column;
   padding: 25px;
   font-size: 12px;
   font-weight: 400;
   color: #2C3A41;
   margin-bottom: 16px;
`;

export default Dashboard;