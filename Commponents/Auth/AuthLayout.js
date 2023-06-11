import React from "react";
import { KeyboardAvoidingView } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../../Hooks/DismissKeyboard";
import Logo from "../Logo";

const AuthLayoutContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 0px 20px;
`;

const AuthLayout = ({ children }) => {
  return (
    <DismissKeyboard>
      <AuthLayoutContainer>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          behavior="padding"
          keyboardVerticalOffset={30}
        >
          <Logo />
          {children}
        </KeyboardAvoidingView>
      </AuthLayoutContainer>
    </DismissKeyboard>
  );
};

export default AuthLayout;
