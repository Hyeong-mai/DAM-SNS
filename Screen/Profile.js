import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { SEE_PROFILE_MUTATION } from "../GraphqlSQL/sql";

const ProfileContainer = styled.View`
  background-color: black;
  align-items: center;
  justify-content: center;
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
const NOTFOUNDWRAP = styled.View`
  flex: 8;
  align-items: center;
  justify-content: center;
`;
const NOTFOUND = styled.Text`
  color: white;
`;
const Profile = ({ navigation, route: { params } }) => {
  const numColumns = 3;
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (params?.username) {
      navigation.setOptions({
        title: data?.seeProfile?.username,
      });
    }
  }, []);
  const { data, loading } = useQuery(SEE_PROFILE_MUTATION, {
    variables: {
      username: params?.username,
    },
  });
  const renderItem = ({ item: photo }) => (
    <TouchableOpacity>
      <Image
        source={{ uri: photo?.file }}
        style={{ width: width / numColumns, height: 130, borderWidth: 0.7 }}
      />
    </TouchableOpacity>
  );
  return (
    <ProfileContainer>
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
            <FollowersText>{data?.seeProfile?.totalFollowers}</FollowersText>
            <FollowersTitle>팔로워</FollowersTitle>
          </Followers>
          <Following>
            <FollowingText>{data?.seeProfile?.totalFollowing}</FollowingText>
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
      {data?.seeProfile?.photos.length !== 0 ? (
        <FlatList
          numColumns={numColumns}
          data={data?.seeProfile?.photos}
          keyExtractor={(photo) => "" + photo.id}
          renderItem={renderItem}
        />
      ) : (
        <NOTFOUNDWRAP>
          <NOTFOUND> 게시물이 없습니다. </NOTFOUND>
        </NOTFOUNDWRAP>
      )}
    </ProfileContainer>
  );
};
export default Profile;
