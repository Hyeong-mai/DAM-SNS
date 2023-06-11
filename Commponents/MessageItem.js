import React from "react";
import styled from "styled-components/native";

const MessageContainer = styled.View`
  padding: 0px 10px;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
  margin-bottom: 20px;
`;
const Author = styled.View``;
const Avatar = styled.Image`
  height: 25px;
  width: 25px;
  border-radius: 25px;
  background-color: tomato;
`;
const Message = styled.Text`
  color: white;
  background-color: ${(props) =>
    props.outGoing ? "rgba(255, 255, 255, 0.2)" : "black"};
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 15px;
  overflow: hidden;
  border-radius: 20px;
  font-size: 16px;
  margin: 0px 10px;
`;
const MessagesItem = ({ message, notMe }) => {
  return (
    <MessageContainer outGoing={message.user.username !== notMe.username}>
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
      </Author>
      <Message>{message.payLoad}</Message>
    </MessageContainer>
  );
};
export default MessagesItem;
