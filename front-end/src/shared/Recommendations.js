import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fetchRecommendedUsers } from '../api/RecommendationsApi';
import { getUserIdFromJWT } from '../helpers/auth';
import LoadingSpinner from '../shared/LoadingSpinner';
import RecommendationsListItem from './RecommendationsListItem';

class Recommendations extends React.Component {
  state = {
    recommendedUsers: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
    this.getRecommendedUsers();
  }

  getRecommendedUsers = async () => {
    const userId = getUserIdFromJWT();

    try {
      const recommendedUsers = await fetchRecommendedUsers(userId);

      this.setState({ recommendedUsers, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false, hasError: true });
    }
  }

  handleInviteRequest = (userId) => async () => {
    // TODO: add connection
    alert(`TODO: Send invite to user ${userId}`);
  }

  handleIgnoreUser = (userId) => async () => {
    // TODO: ignore user
    alert(`TODO: Ignore user ${userId}`);
  }

  renderRecommendedUsersList = () => {
    if (this.state.hasError) {
      return <RecNotification>An error has occurred. Please try again.</RecNotification>
    }

    if (!this.state.recommendedUsers.length) {
      return <RecNotification>No users to recommend!</RecNotification>
    }

    return (
      <RecList>
        {this.state.recommendedUsers.map((user) => {
          return (
            <RecommendationsListItem
              key={user.id}
              email={user.email}
              onInvite={this.handleInviteRequest(user.id)}
              onIgnore={this.handleIgnoreUser(user.id)}
            />
          );
        })}
      </RecList>
    );
  }

  render() {
    return (
      <RecContainer>
        <RecHeader>Recommended Connections</RecHeader>
        <RecSubHeader>Based on your preferred language: {this.props.preferredLanguage || 'No Preference'}</RecSubHeader>
        {this.state.isLoading ? <RecSpinner /> : this.renderRecommendedUsersList()}
      </RecContainer>
    );
  }
}

Recommendations.propTypes = {
  preferredLanguage: PropTypes.string,
}

const RecSpinner = styled(LoadingSpinner)`
  margin: 10px auto;
`

const RecNotification = styled.div`
  text-align: center;
  margin: 10px;
`

const RecHeader = styled.h1`
  margin: 0;
`

const RecSubHeader = styled.h2`
  margin: 5px 0;
  font-size: 1.2em;
`

const RecList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const RecContainer = styled.div`
  width: 75%;
  padding: 15px 30px;
  background-color: #e5e5e5;
  border-radius: 10px;
  margin-bottom: 30px;
`

export default Recommendations;
