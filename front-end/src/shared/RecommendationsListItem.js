import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CancelIcon from './CancelIcon';

class RecommendationsListItem extends React.Component {
  state = {
    hasSentRequest: false,
    messageAfterRequest: '',
  }

  sendRequest = (callback) => {
    this.setState(
      () => ({ hasSentRequest: true }),
      callback,
    );
  }

  handleInvite = () => {
    this.sendRequest(async () => {
      try {
        await this.props.onInvite();

        this.setState({ messageAfterRequest: 'Invite Sent' });
      } catch (err) {
        this.setState({ messageAfterRequest: 'Error Occured' });
      }
    })
  }

  handleIgnore = () => {
    this.sendRequest(async () => {
      try {
        await this.props.onIgnore();

        this.setState({ messageAfterRequest: 'User Ignored' });
      } catch (err) {
        this.setState({ messageAfterRequest: 'Error Occured' });
      }
    })
  }

  render() {
    return (
      <li>
        <RecommendedUserContainer>
          <span>
            {this.props.email}
          </span>
          <ButtonWrapper>
            <InviteButton
              disabled={this.state.hasSentRequest}
              onClick={this.handleInvite}>
              {this.state.messageAfterRequest || 'Invite'}
            </InviteButton>
            <IgnoreButton 
              disabled={this.state.hasSentRequest}
              onClick={this.handleIgnore}>
              <ListCancelIcon />
            </IgnoreButton>
          </ButtonWrapper>
        </RecommendedUserContainer>
      </li>
    );
  }
}

RecommendationsListItem.propTypes = {
  email: PropTypes.string.isRequired,
  onInvite: PropTypes.func.isRequired,
  onIgnore: PropTypes.func.isRequired,
}

const RecommendedUserContainer = styled.div`
  background-color: white;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 5px 20px;
  margin-bottom: 5px;
  align-items: center;
  border: 1px solid #666666;
  border-radius: 4px;
`

const ButtonWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
`

const InviteButton = styled.button`
  cursor: pointer;
  border: none;
  color: #FFFFFF;
  background: #7F337E;
  height: 30px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  margin-right: 8px;

  &:disabled {
    cursor: default;
    background: #e7c3e6;
  }
`

const ListCancelIcon = styled(CancelIcon)`
  width: 30px;
  fill: #e04f5f;
`

const IgnoreButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 0;

  &:disabled {
    cursor: default;

    ${ListCancelIcon} {
      fill: #f7d3d7;
    }
  }
`

export default RecommendationsListItem;