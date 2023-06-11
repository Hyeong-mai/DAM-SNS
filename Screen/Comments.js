import { gql } from "@apollo/client";
import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const CommentsContainer = styled.View`
  padding: 20px 10px;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 5px;
`;
const Avatar = styled.Image`
  height: 45px;
  width: 45px;
  background-color: tomato;
  border-radius: 50px;
  margin-right: 10px;
`;
const CommentTextWrap = styled.View`
  flex-direction: column;
  width: 80%;
`;
const Username = styled.Text`
  color: white;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
`;
const Payload = styled.Text`
  font-size: 15px;
  font-weight: 300;
  color: white;
  margin-bottom: 10px;
`;
const ButtonWrap = styled.View`
  flex-direction: row;
`;
const LikeNum = styled.TouchableOpacity`
  margin-right: 20px;
`;
const GiveComment = styled.TouchableOpacity``;
const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
`;
const LikeButton = styled.TouchableOpacity`
  float: right;
`;

const Comments = ({ id, user, payLoad, isMine, createdAt }) => {
  return (
    <CommentsContainer>
      <Avatar source={{ uri: user.avatar }} />
      <CommentTextWrap>
        <Username>{user.username}</Username>
        <Payload>{payLoad}</Payload>
        <ButtonWrap>
          <LikeNum>
            <ButtonText>좋아요</ButtonText>
          </LikeNum>
          <GiveComment>
            <ButtonText>댓글달기</ButtonText>
          </GiveComment>
        </ButtonWrap>
      </CommentTextWrap>
      <LikeButton>
        <Ionicons name="heart-outline" color={"white"}></Ionicons>
      </LikeButton>
    </CommentsContainer>
  );
};
export default Comments;
