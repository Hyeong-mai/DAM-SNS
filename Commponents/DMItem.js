import { useNavigation } from "@react-navigation/native";
import UseMe from "../Hooks/UseMe";
import React from "react";
import styled from "styled-components/native";
import { colors } from "../Colors";

const RoomContainer = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  background-color: tomato;
  border-radius: 50px;
  margin-right: 15px;
`;
const RoomText = styled.View`
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
`;
const Username = styled.Text`
  margin-bottom: 5px;
  color: white;
  font-size: 14px;
  font-weight: 400;
`;
const PayLoad = styled.Text`
  color: ${(props) => (props.unread > 0 ? "white" : "rgba(255,255,255,0.5)")};
  font-size: 14px;
  font-weight: 900;
`;
const UnreadIcon = styled.View`
  width: 7px;
  height: 7px;
  background-color: ${colors.blue};
  border-radius: 7px;
`;

const DMItem = ({ room }) => {
  const {
    data: { me: meData },
  } = UseMe();
  const navigation = useNavigation();
  const num = (room?.messages).length;
  const notMe = room?.user?.find((user) => user?.username !== meData.username);
  return (
    <RoomContainer
      onPress={() => {
        navigation.navigate("DMRoom", {
          id: room?.id,
          notMe,
        });
      }}
    >
      <Avatar source={{ uri: notMe?.avatar }} />
      <RoomText>
        <Username>{notMe.username}</Username>
        <PayLoad unread={room.unreadTotal}>
          {room.unreadTotal <= 1
            ? room?.messages[num - 1]?.payLoad
            : "새 메시지" + room.unreadTotal + "개"}
        </PayLoad>
      </RoomText>
      {room.unreadTotal !== 0 ? <UnreadIcon /> : null}
    </RoomContainer>
  );
};
export default DMItem;
