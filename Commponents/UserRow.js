import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { FOLLOW_MUTATION, UNFOLLOW_MUTATION } from "../GraphqlSQL/sql";
import { colors } from "../Colors";

const Container = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 100px;
  margin-right: 15px;
  background-color: tomato;
`;
const Username = styled.Text`
  color: white;
`;
const FollowingButton = styled.TouchableOpacity`
  color: white;
  font-weight: 600;
`;
const FollowButton = styled.TouchableOpacity`
  background-color: ${colors.blue};
  justify-content: center;
  padding: 5px 10px;
  border-radius: 4px;
`;
const ButtonText = styled.Text`
  color: white;
`;
const UserRow = ({ id, username, avatar, isMe, isFollowing }) => {
  const navigation = useNavigation();
  const [followUser] = useMutation(FOLLOW_MUTATION, {
    variables: {
      username,
    },
    update: (cache, result) => {
      const {
        data: {
          followUser: { ok },
        },
      } = result;
      if (ok) {
        cache.modify({
          id: `User:${id}`,
          fields: {
            isFollowing(prev) {
              console.log(prev);
              return true;
            },
          },
        });
      }
      return;
    },
  });
  const [unfollowUser] = useMutation(UNFOLLOW_MUTATION, {
    variables: {
      username,
    },
    update: (cache, result) => {
      if (!result?.data?.unFollow) {
        return;
      }
      const {
        data: {
          unFollow: { ok },
        },
      } = result;
      if (!ok) {
        return;
      }
      cache.modify({
        id: `User:${id}`,
        fields: {
          isFollowing: () => false,
        },
      });
    },
  });
  return (
    <Container
      onPress={() =>
        navigation.navigate("Profile", {
          username: username,
          id: id,
        })
      }
    >
      <UserInfo>
        <Avatar resizeMode="cover" source={{ uri: avatar }} />
        <Username>{username}</Username>
      </UserInfo>
      {isMe ? null : isFollowing ? (
        <FollowingButton onPress={unfollowUser}>
          <ButtonText>Unfollow</ButtonText>
        </FollowingButton>
      ) : (
        <FollowButton onPress={followUser}>
          <ButtonText>Follow</ButtonText>
        </FollowButton>
      )}
    </Container>
  );
};
export default UserRow;
