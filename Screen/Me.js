import { useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { SEE_PROFILE } from "../GraphqlSQL/sql";
import { logUserOut } from "../Apollo";
import UseMe from "../Hooks/UseMe";

const MeContainer = styled.View`
  background-color: black;
  align-items: center;
  flex: 1;
  padding: 30px 0px;
`;
const Header = styled.View`
  padding: 0px 25px;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;
const AvatarWrap = styled.View`
  flex-direction: column;
  box-sizing: border-box;
`;
const Avatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  background-color: tomato;
`;

const Action = styled.View`
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const List = styled.View`
  align-items: center;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
`;
const Followers = styled.View`
  align-items: center;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
`;
const Following = styled.View`
  align-items: center;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
`;
const ListText = styled.Text`
  color: white;
`;
const ListTitle = styled.Text`
  color: white;
`;
const FollowersText = styled.Text`
  color: white;
`;
const FollowersTitle = styled.Text`
  color: white;
`;
const FollowingText = styled.Text`
  color: white;
`;
const FollowingTitle = styled.Text`
  color: white;
`;
const UserInfo = styled.View`
  padding: 10px 25px;
  width: 100%;
  flex-direction: column;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const Bio = styled.Text`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`;
const EditBtn = styled.TouchableOpacity`
  padding: 5px;
  background-color: black;
  border-radius: 10px;
  width: 90%;
  margin: 10px;
  align-items: center;
  justify-content: center;
`;
const ButtonText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
`;
const LogOutWrap = styled.TouchableOpacity`
  padding: 10px 20px;
`;
const LogoutText = styled.Text`
  color: rgba(255, 147, 81, 1);
  font-size: 12px;
  font-weight: 600;
  margin-right: 5px;
`;

const Me = ({ navigation }) => {
  const UserData = UseMe();
  console.log(UserData);
  useEffect(() => {
    navigation.setOptions({
      title: UserData?.data?.me?.username,
      headerRight: Logout,
    });
  }, []);
  const numColumns = 3;
  const { width } = useWindowDimensions();
  const { data, loading } = useQuery(SEE_PROFILE, {
    variables: {
      username: UserData?.data?.me?.username,
    },
  });

  const logOutUser = async () => {
    Alert.alert("Log Out", `Log out of ${data?.seeProfile?.username}`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Log out",
        onPress: () => logUserOut(),
        style: "destructive",
      },
    ]);
  };
  const Logout = () => (
    <LogOutWrap onPress={() => logOutUser()}>
      <LogoutText>Log out</LogoutText>
    </LogOutWrap>
  );

  const renderItem = ({ item: photo }) => (
    <TouchableOpacity>
      <Image
        source={{ uri: photo?.file }}
        style={{
          width: width / numColumns,
          height: width / numColumns,
          borderWidth: 0.7,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <MeContainer>
      {loading ? null : (
        <>
          <Header>
            <AvatarWrap>
              <Avatar
                resizeMode="cover"
                source={{ uri: data?.seeProfile?.avatar }}
              />
            </AvatarWrap>
            <Action>
              <List>
                <ListText>{data?.seeProfile?.photos?.length}</ListText>
                <ListTitle>게시물</ListTitle>
              </List>
              <Followers>
                <FollowersText>
                  {data?.seeProfile?.totalFollowers}
                </FollowersText>
                <FollowersTitle>팔로워</FollowersTitle>
              </Followers>
              <Following>
                <FollowingText>
                  {data?.seeProfile?.totalFollowing}
                </FollowingText>
                <FollowingTitle>팔로잉</FollowingTitle>
              </Following>
            </Action>
          </Header>
          <UserInfo>
            <Username>{data?.seeProfile?.username}</Username>
            <Bio>{data?.seeProfile?.bio}</Bio>
          </UserInfo>
          {data?.seeProfile?.isMe ? (
            <EditBtn>
              <ButtonText>프로필 수정</ButtonText>
            </EditBtn>
          ) : null}
          <FlatList
            numColumns={numColumns}
            data={data?.seeProfile?.photos}
            keyExtractor={(photo) => "" + photo.id}
            renderItem={renderItem}
          />
        </>
      )}
    </MeContainer>
  );
};
export default Me;
