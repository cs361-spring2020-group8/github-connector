import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ConnectionsListItem = ({ id, imageURL, username }) => {
  return (
    <li>
      <ConnectionsUserContainer>
        <UserImage src={imageURL} alt="avatar" />
        <span>
          <Link to={`/users/${id}`}>
            {username}
          </Link>
        </span>
      </ConnectionsUserContainer>
    </li>
  );
}

ConnectionsListItem.propTypes = {
  id: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

const ConnectionsUserContainer = styled.div`
  background-color: white;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding: 5px 20px;
  margin-bottom: 5px;
  align-items: center;
  border: 1px solid #666666;
  border-radius: 4px;
  height: 40px;
`

const UserImage = styled.img`
  height: 30px;
  margin-right: 8px;
`

export default ConnectionsListItem;