import React from 'react';
import styled from 'styled-components';
import { getUserIdFromJWT } from '../helpers/auth';
import { fetchRecommendedUsers } from '../api/RecommendationsApi';
import RecommendationsListItem from './RecommendationsListItem';

class Recommendations extends React.Component {
  state = {
    recommendedUsers: [],
  }

  componentDidMount() {
    this.getRecommendedUsers();
  }

  getRecommendedUsers = async () => {
    const userId = getUserIdFromJWT();

    try {
      const recommendedUsers = await fetchRecommendedUsers(userId);

      this.setState({ recommendedUsers });
    } catch (err) {

    }
  }

  render() {
    return (
      <RecommendationsContainer>
        <RecommendationsHeader>Recommended Connections</RecommendationsHeader>
        <RecommendationsList>
          {this.state.recommendedUsers.map((user) => {
            return <RecommendationsListItem key={user.id} id={user.id} email={user.email} />
          })}
        </RecommendationsList>
      </RecommendationsContainer>
    );
  }
}

const RecommendationsHeader = styled.h1`
  margin: 0;
`

const RecommendationsList = styled.ul`
  list-style-type: none;
  padding-left: 20px;
`

const RecommendationsContainer = styled.div`
  width: 75%;
  padding: 15px 30px;
  background-color: #e5e5e5;
  border-radius: 10px;
  margin-bottom: 30px;
`

export default Recommendations;
