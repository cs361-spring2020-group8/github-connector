import React from 'react';
import styled from 'styled-components';
import * as ConnectionsApi from '../../api/ConnectionsApi';
import LoadingSpinner from '../../shared/LoadingSpinner';
import SideBarNav from '../../shared/SideBarNav';


class UserProfile extends React.Component {
  state = {
    id: '',
    email: '',
    phone: '',
    twitter: '',
    github_info: {},
    isLoading: true,
    hasError: false
  };

  componentDidMount() {
    this.getUser(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getUser(this.props.match.params.id);
    }
  }

  getUser = async (userId) => {
    try {
      const profile = await ConnectionsApi.getUserConnection(userId);

      this.setState((prevState) => ({
        ...prevState,
        ...profile,
        isLoading: false,
        hasError: false
      }));
    } catch (err) {
      this.setState({ isLoading: false, hasError: true });
    }
  }

  renderUsername = () => {
    if (this.state.github_info && this.state.github_info.github_username) {
      return (
        <div>
          <a href={`https://github.com/${this.state.github_info.github_username}`}>
            {this.state.github_info.github_username}
          </a>
        </div>
      )
    } else {
      return <div>{this.state.email}</div>
    }
  }

  renderGitHubImage = () => {
    if (this.state.github_info && this.state.github_info.profile_image_url) {
      return <ImageContainer src={this.state.github_info.profile_image_url} alt='userGHImage' />;
    } else {
      return <ImageContainer src={process.env.PUBLIC_URL + '/default_avatar.png'} alt='userDefault' />;
    }
  }

  renderLanguage = () => {
    const githubLanguage = this.state.github_info.language || 'None Listed';
    return <div>Github Language: {githubLanguage}</div>;
  }

  renderProfileCardContent = () => {
    return (
      <>
        <div>Profile Information:</div>
        <br />
        <div>Email: <a href={`mailto:${this.state.email}`}>{this.state.email}</a></div>
        {!!this.state.phone && <div>Phone: {this.state.phone}</div>}
        {!!this.state.twitter && (
          <div>
            Twitter: <a href={`https://twitter.com/${this.state.twitter}/`}>@{this.state.twitter}</a>
          </div>
        )}
      </>
    );
  }

  renderProfileCard = () => {
    if (this.state.hasError) {
      return <h2>User Not Found</h2>
    } else {
      return (
        <ProfileContentContainer>
          <UserProfileImage>
            {this.renderGitHubImage()}
          </UserProfileImage>
          <ProfileContent>
            <ProfileCardHeading>
              {this.renderUsername()}
            </ProfileCardHeading>
            <ProfileCardContent>
              {this.renderProfileCardContent()}
            </ProfileCardContent>
          </ProfileContent>
        </ProfileContentContainer>
      )
    }
  }

  render() {
    return (
      <DashboardContainer>
        <SideBarNav />
        <RightPanel>
          {this.state.isLoading ? <LoadingSpinner /> : this.renderProfileCard()}
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

const ProfileContentContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: row;
  background: #e5e5e5;
  border-radius: 10px;
  overflow: hidden;
`;

const UserProfileImage = styled.div`
  display:flex;
  padding: 25px;
`;

const ImageContainer = styled.img`
  height: 150px;
`

const ProfileCardContent = styled.div`
   font-size: 16px;
   font-weight: 400;
   color: #2C3A41;
   margin-bottom: 32px;
`;

const ProfileCardHeading = styled.div`
  font-size: 36px;
  font-weight: 400;
  color: #2C3A41;
  margin-bottom: 32px;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
`;

export default UserProfile;