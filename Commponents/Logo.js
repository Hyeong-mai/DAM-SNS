import React from "react";
import styled from "styled-components/native";
import { colors } from "../Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const LogoImage = styled.View`
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.Text`
  font-weight: 900;
  font-size: 24px;
  color: ${colors.blue};
`;

const Logo = () => {
  return (
    <LogoImage>
      <LogoText>
        먹 DAM <Ionicons name={"restaurant"} color={colors.blue} size={12} />
      </LogoText>
    </LogoImage>
  );
};
export default Logo;
