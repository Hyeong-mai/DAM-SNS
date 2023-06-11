import React, { useState } from "react";
import styled from "styled-components/native";
import { colors } from "../Colors";
import AuthButton from "../Commponents/Auth/AuthButton";
import AuthLayout from "../Commponents/Auth/AuthLayout";

const LoginView = styled.TouchableOpacity``;
const LoginText = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
`;

const Welcome = ({ navigation }) => {
  const gotoCreateAccount = () => navigation.navigate("CreateAccount");
  const gotoLogIn = () => navigation.navigate("Login");

  return (
    <AuthLayout>
      <AuthButton
        text={"Create New Account"}
        disabled={false}
        onPress={gotoCreateAccount}
      />
      <LoginView onPress={gotoLogIn}>
        <LoginText>Log in</LoginText>
      </LoginView>
    </AuthLayout>
  );
};
export default Welcome;
