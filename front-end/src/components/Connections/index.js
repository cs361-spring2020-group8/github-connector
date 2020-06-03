import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchConnections } from '../../api/ConnectionsApi';
import ConnectionsListItem from '../../shared/ConnectionsListItem';
import LoadingSpinner from '../../shared/LoadingSpinner';
import SideBarNav from '../../shared/SideBarNav';
import { getUserIdFromJWT } from '../../helpers/auth';


class Connections extends React.Component {
  state = {
    connections: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
    this.loadConnections();
  }

  loadConnections = async () => {
    try {
      const connections = await fetchConnections(getUserIdFromJWT());

      this.setState({ isLoading: false, connections });
    } catch (err) {
      this.setState({ isLoading: false, hasError: true });
    }
  }

  renderConnections = () => {
    if (this.state.hasError) {
      return <span>An error has occured. Please try again.</span>
    } else if (!this.state.connections.length) {
      return <span>No connections yet! Try adding some users from your <Link to="/recommendations">recommendations</Link>.</span>
    } else {
      return this.state.connections.map(connection => (
        <ConnectionsListItem
          key={connection.id}
          id={connection.id}
          imageURL={connection.github_info.profile_image_url}
          githubName={connection.github_info.github_username}
        />
      ))
    }
  }

  render() {
    return (
      <DashboardContainer>
        <SideBarNav />
        <RightPanel>
          <ConnectiosnContainer>
            <ConnectionsHeader>Your Connections</ConnectionsHeader>
            <ConnectionsList>
              {this.state.isLoading ? <Loading /> : this.renderConnections()}
            </ConnectionsList>
          </ConnectiosnContainer>
        </RightPanel>
      </DashboardContainer>
    )
  }
}

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: flex-start;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 100vh;
`;

const ConnectionsHeader = styled.h1`
  margin: 0;
`

const ConnectionsList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const ConnectiosnContainer = styled.div`
  width: 75%;
  padding: 15px 30px;
  background-color: #e5e5e5;
  border-radius: 10px;
  margin-bottom: 30px;
`

const Loading = styled(LoadingSpinner)`
  margin: 0 auto;
`

export default Connections;
