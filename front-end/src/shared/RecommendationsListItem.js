import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RecommendationsListItem = ({ id, email }) => {
  return (
    <li>
      <RecommendedUserContainer>
        <span>
          {email}
        </span>
        <div style={{ whiteSpace: 'nowrap' }}>
          <button>
            Invite
          </button>
          <button>
            X Cancel
          </button>
        </div>
      </RecommendedUserContainer>
    </li>
  );
}

RecommendationsListItem.propTypes = {
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
}

const RecommendedUserContainer = styled.div`
  background-color: white;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 5px;
`


export default RecommendationsListItem;