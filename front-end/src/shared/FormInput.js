import React from 'react';
import styled from 'styled-components';

class FormInput extends React.Component {
  render() {
    return (
      <Label>
        <Heading>
          {this.props.heading}:
        </Heading>
        <Input type={this.props.type} value={this.props.value} onChange={this.props.onChange}/>
      </Label>
    )
  }
}

const Label = styled.label`
  display: inline-block;
  margin-bottom: 16px;
`;

const Heading = styled.div`
  color: #212b31;
  margin-bottom: 8px;
`;

const Input = styled.input`
  box-sizing: border-box;
  border: 1px solid #d5d6da;
  border-radius: 3px;  
  font-size: 14px;
  width: 30vw;
  height: 28px;
  padding-left: 8px;
`;

export default FormInput;