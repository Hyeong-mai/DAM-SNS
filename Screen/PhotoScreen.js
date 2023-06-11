import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import styled from "styled-components/native";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../GraphqlSQL/fragments";
import Photo from "../Commponents/FeedPhoto";
import ScreenLayout from "../Commponents/ScreenLayout";
import Comments from "./Comments";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import UseMe from "../Hooks/UseMe";

const SEE_PHOTO_QUERY = gql`
  query SeePhoto($seePhotoId: Int!) {
    seePhoto(id: $seePhotoId) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const CREATE_COMMENT = gql`
  mutation Mutation($photoId: Int!, $payLoad: String!) {
    createComment(photoId: $photoId, payLoad: $payLoad) {
      ok
      id
    }
  }
`;

const InputContainer = styled.View`
  width: 100%;
  padding: 20px;
  border-color: rgba(255, 255, 255, 0.1);
  border-top-width: 1px;
  flex-direction: row;
  justify-content: space-around;
`;

const Input = styled.TextInput`
  color: white;
  width: 80%;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  background-color: black;
`;
const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 40px;
  background-color: tomato;
`;
const PhotoScreen = ({ route: { params } }) => {
  const { data: userData } = UseMe();
  const updateComment = (cache, result) => {
    const { payLoad } = getValues();
    setValue("payLoad", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;

    if (ok && userData) {
      const newComment = {
        __typename: "Comment",
        id,
        isMine: true,
        payLoad,
        user: {
          ...userData.me,
        },
      };
      cache.modify({
        id: `Photo:${params?.id}`,
        fields: {
          comments(prev) {
            return [...prev, newComment];
          },
          commentsNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createComment, { loading: mutationLoading }] = useMutation(
    CREATE_COMMENT,
    {
      update: updateComment,
    }
  );
  const { data, loading, refetch } = useQuery(SEE_PHOTO_QUERY, {
    variables: {
      seePhotoId: params.id,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const [ContainerHeight, setContainerHeight] = useState();
  const { register, handleSubmit, watch, setValue, getValues } = useForm();
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const renderHeaderPhoto = () => {
    return <Photo detail={true} {...data?.seePhoto} />;
  };
  const renderComment = ({ item: comment }) => {
    return <Comments {...comment} />;
  };
  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };
  const onValid = ({ payLoad }) => {
    if (!mutationLoading) {
      createComment({
        variables: {
          photoId: params.id,
          payLoad,
        },
      });
    }
  };
  useEffect(() => {
    register("payLoad", {
      required: true,
      minLength: 3,
    });
  }, [register]);

  const renderData = data?.seePhoto?.comments;
  return (
    <ScreenLayout loading={loading}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={ContainerHeight}
      >
        <FlatList
          style={{ width: "100%" }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={refreshing}
          data={renderData}
          keyExtractor={(comment) => "" + comment.id}
          ListHeaderComponent={renderHeaderPhoto}
          renderItem={renderComment}
        />
        <InputContainer onLayout={onLayout}>
          <Avatar source={{ uri: data?.seePhoto?.user?.avatar }} />
          <Input
            value={watch("payLoad")}
            placeholder="Write comment.."
            placeholderTextColor={"rgba(255,255,255,0.3)"}
            returnKeyLabel="done"
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => {
              setValue("payLoad", text);
            }}
            onSubmitEditing={handleSubmit(onValid)}
          />
        </InputContainer>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};
export default PhotoScreen;
