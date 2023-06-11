import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import {
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useMutation } from "@apollo/client";
import { LIKE_MUTATION } from "../GraphqlSQL/sql";
import Logo from "./Logo";

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: white;
  margin-left: 5px;
`;
const Likes = styled.Text`
  color: white;
  margin: 7px 0px;
  font-weight: 600;
`;
const ExtraContainer = styled.View`
  padding: 10px;
`;

const ButtonWrap = styled.TouchableOpacity``;
const ButtonText = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  margin-top: 10px;
`;
const Photo = ({
  id,
  user,
  caption,
  file,
  isLiked,
  likes,
  commentsNumber,
  detail,
}) => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      if (width > 1000 && height > 1000) {
        setImageHeight(height / 8);
      } else {
        setImageHeight(height / 3);
      }
    });
    navigation.setOptions({
      headerTitle: ProfileHeader,
    });
  }, [file]);
  const ProfileHeader = () => {
    if (detail) {
      return (
        <Header onPress={goToProfile}>
          <Username>{user?.username}</Username>
        </Header>
      );
    }
    return <Logo />;
  };
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            console.log(prev);
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation(LIKE_MUTATION, {
    variables: {
      toggleLikeId: id,
    },
    update: updateToggleLike,
  });
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user?.username,
      id: user?.id,
    });
  };
  return (
    <Container>
      {!detail ? (
        <Header onPress={goToProfile}>
          <UserAvatar resizeMode="cover" source={{ uri: user?.avatar }} />
          <Username>{user?.username}</Username>
        </Header>
      ) : null}

      <File
        resizeMode="cover"
        style={{
          width,
          height: imageHeight,
        }}
        source={{ uri: file }}
      />
      <ExtraContainer>
        <Actions>
          <Action onPress={toggleLikeMutation}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : "white"}
              size={22}
            />
          </Action>
          <Action onPress={() => navigation.navigate("Comments")}>
            <Ionicons name="chatbubble-outline" color="white" size={22} />
          </Action>
        </Actions>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Likes", {
              photoId: id,
            })
          }
        >
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <Username>{user?.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
        {!detail ? (
          <ButtonWrap
            onPress={() => {
              navigation.navigate("Photo", {
                id,
              });
            }}
          >
            <ButtonText>
              {commentsNumber > 0
                ? commentsNumber + "개의 댓글보기"
                : "자세히 보기"}
            </ButtonText>
          </ButtonWrap>
        ) : null}
      </ExtraContainer>
    </Container>
  );
};
Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  commentNumber: PropTypes.number,
};
export default Photo;
