import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

const NotificationContainer = styled.View`
  flex: 1;
  background-color: black;
  align-items: center;
  justify-content: center;
`;
const NotificationTitle = styled.Text`
  color: white;
`;
const Notification = () => {
  return (
    <NotificationContainer>
      <NotificationTitle>Notification</NotificationTitle>
    </NotificationContainer>
  );
};
export default Notification;
