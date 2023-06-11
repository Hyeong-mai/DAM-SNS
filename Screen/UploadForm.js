import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { gql, useMutation } from "@apollo/client";
import DismissKeyboard from "../Hooks/DismissKeyboard";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FEED_PHOTO } from "../GraphqlSQL/fragments";
import { useForm } from "react-hook-form";
import { ReactNativeFile } from "apollo-upload-client";

const UPLOAD_PHOTO = gql`
  mutation Mutation($file: Upload!, $caption: String, $address: String) {
    uploadPhoto(file: $file, caption: $caption, address: $address) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const HeaderRightText = styled.Text`
  color: #0095f6;
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 20px 0;
`;
const Photo = styled.Image`
  width: 80%;
  height: 100%;
`;
const CaptionContainer = styled.View`
  flex-direction: row;
  padding: 5px;
  margin-bottom: 10px;
  width: 100%;
  height: 40%;
  justify-content: center;
  align-items: center;
`;
const InputColum = styled.View`
  width: 75%;
  padding-left: 10px;
  height: 80px;
  flex-direction: column;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 20px;
  box-shadow: 0px -1px 0px rgba(255, 255, 255, 0.2);
  background-color: black;
  height: 100px;
`;
const Column = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
const Caption = styled.TextInput`
  width: 90%;
  height: 90%;
  color: white;
  align-content: center;
  justify-content: center;
  padding: 10px;
`;

const UploadForm = ({ route, navigation }) => {
  const { setValue, register, handleSubmit } = useForm();
  const addressRef = useRef();
  const updateUploadPhoto = (cache, result) => {
    const {
      data: { uploadPhoto },
    } = result;
    if (uploadPhoto.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev) {
            return [uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate("TabNav");
    }
  };
  const [uploadPhotoMutation, { loading }] = useMutation(UPLOAD_PHOTO, {
    update: updateUploadPhoto,
  });
  const onValid = ({ caption, address }) => {
    if (loading) {
      return;
    }
    const file = new ReactNativeFile({
      uri: route?.params?.uri,
      name: "1.jpg",
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables: {
        file,
        caption,
        address,
      },
    });
  };
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>Done</HeaderRightText>
    </TouchableOpacity>
  );
  const HeaderRightLoading = () => (
    <ActivityIndicator
      size={"small"}
      color="#0095f6"
      style={{ marginRight: 7 }}
    />
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);
  useEffect(() => {
    register("caption", {
      required: true,
    });
    register("address", {
      required: true,
      minLength: 3,
    });
  }, [register]);
  const onNext = (refName) => {
    refName?.current?.focus();
  };
  return (
    <DismissKeyboard>
      <Container>
        <CaptionContainer>
          <Photo resizeMode="contain" source={{ uri: route?.params?.uri }} />
        </CaptionContainer>
        <Row>
          <Caption
            returnKeyType="done"
            multiline={true}
            placeholder="Write a Caption..."
            placeholderTextColor={"rgba(255, 255, 255 , 0.3)"}
            onEndEditing={() => onNext(addressRef)}
            onChangeText={(text) => setValue("caption", text)}
          />
        </Row>
        <Row>
          <Caption
            ref={addressRef}
            returnKeyType="done"
            multiline={true}
            placeholder="Write a Address..."
            placeholderTextColor={"rgba(255, 255, 255 , 0.3)"}
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={(text) => setValue("address", text)}
          />
        </Row>
        <Row>
          <Column>Facebook</Column>
          <Column>
            <Ionicons
              color={"rgba(255,255,255,0.3)"}
              name={"chevron-forward"}
              size={32}
            />
          </Column>
        </Row>
        <Row>
          <Column>Twitter</Column>
          <Column>
            <Ionicons
              color={"rgba(255,255,255,0.3)"}
              name={"chevron-forward"}
              size={32}
            />
          </Column>
        </Row>
        <Row>
          <Column>Tumblr</Column>
          <Column>
            <Ionicons
              color={"rgba(255,255,255,0.3)"}
              name={"chevron-forward"}
              size={32}
            />
          </Column>
        </Row>
        <Row>
          <Column>Advanced Settings</Column>
          <Column>
            <Ionicons
              color={"rgba(255,255,255,0.3)"}
              name={"chevron-forward"}
              size={32}
            />
          </Column>
        </Row>
      </Container>
    </DismissKeyboard>
  );
};
export default UploadForm;
