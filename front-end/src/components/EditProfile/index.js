import React from 'react';
import styled from 'styled-components';
import SideBarNav from '../../shared/SideBarNav';
import jwt_decode from 'jwt-decode'
import * as DashboardApi from '../../api/DashboardApi';
import FormInput from "../../shared/FormInput";
import { Link, withRouter } from "react-router-dom";



class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      phone: '',
      twitter: '',
      github_username:'',
      github_info: null,
      isLoaded: false,
      hasAuthError: false,
      hasServerError: false,
      hasGithubProfileNotFoundError: false,
      token: ''
    };
  }

  getJWTTokenAndID(){
    const token = localStorage.getItem('access_token');
    const decodedToken = jwt_decode(token);
    const userID = decodedToken.id;

    this.setState({
      id: userID,
      token: token
    })

    return decodedToken;
  }

  componentDidMount() {
    this.getJWTTokenAndID();

    this.setState({hasAuthError: false, hasServerError: false}, async () => {
      try {
        const res = await DashboardApi.pullUserInfo(this.state.id, this.state.token);
        if (res.status === 200) {
          this.setState({
            isLoaded: true,
            id: res.data[0].id,
            email: res.data[0].email,
            twitter: res.data[0].twitter || '',
            phone: res.data[0].phone || '',
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

  handleChange = (field, event) => {
    this.setState({
      [field]: event.target.value
    })
  }


  handleGithubProfileFormSubmit = async (event) =>{
    event.preventDefault();

    this.setState({hasAuthError: false, hasServerError: false}, async () => {
      try {
        const res = await DashboardApi.linkGithubAccount(this.state.id, this.state.token, this.state.github_username);
        if (res.status === 200) {
          this.props.history.push('/dashboard');
        }
      } catch (e) {

        const {response: {status}} = e
        if ( status === 404) {
          this.setState({hasGithubProfileNotFoundError: true});
        }
        else if (status >= 405 && status < 500) {
          this.setState({hasAuthError: true});
        } else {
          this.setState({hasServerError: true});
        }
      }
    });
  }

  handleUpdateInfoFormSubmit = async (event) =>{
    event.preventDefault();

    this.setState({hasAuthError: false, hasServerError: false}, async () => {
      try {
        const res = await DashboardApi.updateProfileInfo(this.state.id, this.state.token, this.state.email, this.state.twitter, this.state.phone);
        if (res.status === 200) {
          this.props.history.push('/dashboard');
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

  render() {
    return (
      <DashboardContainer>
        <SideBarNav>
        </SideBarNav>
        <RightPanel>
          <DashboardContentContainer>
            <DashboardUserContent>
              {!this.state.github_info &&
                <>
                <DashboardContentHeading>
                  Attach Github Account
                </DashboardContentHeading>
                <DashboardContent>
                  <FormContainer onSubmit={this.handleGithubProfileFormSubmit}>
                    <FormInput heading="Github Username" type="text" value={this.state.github_username} onChange={(event) => this.handleChange("github_username", event) }/>
                    <SubmitButton type="submit" value="Attach Account"/>
                    <ErrorText>
                      { this.state.hasGithubProfileNotFoundError && "No Github profile with that username found. Please try again." }
                    </ErrorText>
                  </FormContainer>
                </DashboardContent>
                </> }
              <DashboardContentHeading>
                Edit Profile...
              </DashboardContentHeading>
              <DashboardContent>
                <FormContainer onSubmit={this.handleUpdateInfoFormSubmit}>
                  <FormInput heading="Email" type="email" value={this.state.email} onChange={(event) => this.handleChange("email", event)}/>
                  <FormInput heading="Twitter" type="text" value={this.state.twitter} onChange={(event) => this.handleChange("twitter", event)}/>
                  <FormInput heading="Phone" type="phone" value={this.state.phone} onChange={(event) => this.handleChange("phone", event)}/>
                  <SubmitButton type="submit" value="Update Profile"/>
                </FormContainer>
              </DashboardContent>
              <ReturnToDashboard>
                <Link to='/dashboard'>Return To Dashboard</Link>
              </ReturnToDashboard>
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

const FormContainer = styled.form`
  width: 30vw;
`;

const SubmitButton = styled.input`
  cursor: pointer;
  border: none;
  color: #FFFFFF;
  background: #7F337E;
  height: 40px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 16px;
  text-align: center;
  min-height: 24px;
`;

const ReturnToDashboard = styled.div`
  display: flex;
  font-size: 12px;
  justify-content: center;
`;

export default withRouter(EditProfile);