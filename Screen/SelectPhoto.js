import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import { FlatList, Image, useWindowDimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../Colors";

const SelectPhotoContainer = styled.View`
  flex: 1;
  background-color: black;
`;
const Top = styled.View`
  flex: 1;
`;
const Bottom = styled.View`
  flex: 1;
`;
const ImageContainer = styled.TouchableOpacity`
  border: 1px;
`;
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
`;
const HeaderRightButton = styled.TouchableOpacity`
  margin-right: 7px;
`;
const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
`;

const SelectPhoto = ({ navigation }) => {
  const [ok, setOK] = useState(false);
  const [photoLocal, setPhotoLocal] = useState("");
  const [photos, setPhotos] = useState([]);
  const [choosePhoto, setChoosePhoto] = useState();
  const { width } = useWindowDimensions();
  const numColumns = 4;

  const getPhotos = async () => {
    const { assets: photo } = await MediaLibrary.getAssetsAsync();
    setPhotos(photo);
    setChoosePhoto(photo[0]);
  };
  const reLoadPhotos = async () => {
    const { assets: reLoadphotos } = await MediaLibrary.getAssetsAsync({
      after: photos[photos.length - 1].id,
    });

    setPhotos([...photos, ...reLoadphotos]);
  };
  const getPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();
    if (accessPrivileges === "none" && !canAskAgain) {
      if (accessPrivileges !== "none") {
        setOK(true);
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      setOK(true);
      getPhotos();
    }
  };
  const ChoosingPhoto = async (photo) => {
    // const assetInfo = await MediaLibrary.getAssetInfoAsync(id);
    // setPhotoLocal(assetInfo.localUri);
    setChoosePhoto(photo);
  };
  useEffect(() => {
    getPermissions();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "이미지 선택",
      headerRight: HeaderRight,
    });
  }, [choosePhoto, photoLocal]);
  const HeaderRight = () => {
    return (
      <HeaderRightButton onPress={goToUpload}>
        <HeaderRightText>Next</HeaderRightText>
      </HeaderRightButton>
    );
  };
  const goToUpload = async () => {
    const assetInfo = await MediaLibrary.getAssetInfoAsync(choosePhoto?.id);
    if (ok) {
      navigation.navigate("UploadForm", {
        uri: assetInfo.localUri,
      });
    }
  };
  const renderPhoto = ({ item: photo }) => {
    return (
      <ImageContainer
        onPress={() => {
          ChoosingPhoto(photo);
        }}
      >
        <Image
          source={{ uri: photo?.uri }}
          style={{
            width: width / numColumns,
            height: width / numColumns,
          }}
        />
        <IconContainer>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={choosePhoto?.uri === photo.uri ? colors.blue : "white"}
          />
        </IconContainer>
      </ImageContainer>
    );
  };
  return (
    <SelectPhotoContainer>
      <Top>
        {choosePhoto ? (
          <Image
            source={{ uri: choosePhoto?.uri }}
            style={{ width, height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <FlatList
          onEndReachedThreshold={0.02}
          onEndReached={() => {
            reLoadPhotos();
          }}
          numColumns={4}
          data={photos}
          keyExtractor={(photo) => "" + photo.id}
          renderItem={renderPhoto}
        />
      </Bottom>
    </SelectPhotoContainer>
  );
};
export default SelectPhoto;
