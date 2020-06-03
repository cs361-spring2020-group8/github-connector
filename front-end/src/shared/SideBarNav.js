import React from 'react';
import styled from 'styled-components';
import Logo from '../svg/Logo';
import { Link } from "react-router-dom";

class SideBarNav extends React.Component {
  handleSignOut = () => {
    localStorage.removeItem('access_token');
    window.location.href = "/login";
  }

  render() {
    return (
      <LeftPanel>
        <Logo fill="#FFFFFF" height="20%" />
        <div>
            Github Connector
        </div>
        <LinkList>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/connections">Connections</Link></li>
            <li onClick={this.handleSignOut}><Link to="#">Sign Out</Link></li>
          </ul>
        </LinkList>
      </LeftPanel>
    )
  }
}

const LinkList = styled.div`
  display:flex;
  justify-content: flex-start;

  ul {
    list-style-type:none;
    padding:0;
  };
  ul li {
    margin-bottom:15px;
  };
  ul li a {
    text-decoration:none;
    color:#FFFFFF;
    background-color:#1A2E38;
    padding: 5px 10px 5px 10px;
  };
  ul li a:hover {
    background-color:#39667d;
  };
  ul:after {
    content: "";
    clear:both;
    display:block;
  };
`;

const LeftPanel = styled.div`
  display: flex;
  width: 15vw;
  align-items: center;
  flex-direction: column;
  background: #1A2E38;
  color: #fff;
  font-size: 16px;
  padding-top: 7.5vh;
`;

export default SideBarNav;