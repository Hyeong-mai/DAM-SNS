import React from "react";
import styled from "styled-components/native";
import { colors } from "../../Colors";
import { ActivityIndicator } from "react-native";

const Button = styled.TouchableOpacity`
  border-radius: 3px;
  padding: 15px 10px;
  background-color: ${colors.blue};
  width: 100%;
  margin-top: 10px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

const AuthButton = ({ disabled, onPress, text, loading }) => {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={"white"} />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
};

export default AuthButton;
