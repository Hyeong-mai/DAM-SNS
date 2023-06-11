import Slider from "@react-native-community/slider";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, StatusBar, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";

const TakePhotoContainer = styled.View`
  flex: 1;
  background-color: black;
`;
const Action = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
  flex: 0.2;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const SlideContainer = styled.View`
  padding: 5px;
  flex: 0.3;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const ButtonWrap = styled.View`
  width: 100%;
  flex: 0.7;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  padding: 20px 0px;
`;
const TakePhotoButton = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
`;
const FlipCameraButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
`;
const ZoomCameraButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;
const CloseButton = styled.TouchableOpacity`
  margin: 15px 30px;
  position: absolute;
`;
const PhotoActionButton = styled.TouchableOpacity`
  background-color: white;
  padding: 5px;
  border-radius: 5px;
`;
const PhotoActionText = styled.Text`
  font-weight: 600;
`;
const ImageWrap = styled.View`
  flex: 1;
`;
const CameraWrap = styled.View`
  flex: 1;
`;
const Wrap = styled.View`
  flex: 1;
`;
const TakePhoto = ({ navigation }) => {
  const camera = useRef();
  const [takenPhoto, setTakenPhoto] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [zoomValue, setZoomValue] = useState(0);
  const [flashType, setFlashType] = useState(Camera.Constants.FlashMode.off);
  const { width } = useWindowDimensions();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const getPermissions = async () => {
    const { granted, canAskAgain } = await Camera.getCameraPermissionsAsync();
    if (!granted && canAskAgain) {
      const { granted } = await Camera.requestCameraPermissionsAsync();
      if (granted) {
        setOk(granted);
      }
    } else if (granted) {
      setOk(granted);
    }
  };
  useEffect(() => {
    getPermissions();
  });
  const cameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.back) {
      setCameraType(Camera.Constants.Type.front);
    } else {
      setCameraType(Camera.Constants.Type.back);
    }
  };
  const CameraFlash = () => {
    if (flashType === Camera.Constants.FlashMode.off) {
      setFlashType(Camera.Constants.FlashMode.on);
    } else if (flashType === Camera.Constants.FlashMode.on) {
      setFlashType(Camera.Constants.FlashMode.auto);
    } else if (flashType === Camera.Constants.FlashMode.auto) {
      setFlashType(Camera.Constants.FlashMode.off);
    }
  };
  const onChangeZoomValue = (e) => {
    setZoomValue(e);
  };
  const onCameraReady = () => {
    setCameraReady(true);
  };
  const takePicture = async () => {
    if (camera.current && cameraReady) {
      const { uri } = await camera.current.takePictureAsync({
        quilty: 1,
        exif: true,
      });
      if (uri) {
        setTakenPhoto(uri);
      }
    }
  };
  const onDismiss = () => {
    setTakenPhoto("");
  };
  const goToLoad = async (save) => {
    if (save) {
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
    navigation.navigate("UploadForm", {
      uri: takenPhoto,
    });
  };
  const onUpload = () => {
    Alert.alert("Save Photo?", "Save Photo & Upload or Just Upload", [
      {
        text: "Save & Upload",
        onPress: () => goToLoad(true),
      },
      {
        text: "Just Upload",
        onPress: () => goToLoad(false),
      },
    ]);
  };
  const focused = useIsFocused();
  return (
    <TakePhotoContainer>
      <CameraWrap>
        {takenPhoto === "" ? (
          focused ? (
            <Wrap>
              <StatusBar hidden={focused} />
              <Camera
                type={cameraType}
                style={{ flex: 1 }}
                zoom={zoomValue}
                ref={camera}
                onCameraReady={onCameraReady}
              >
                <CloseButton
                  onPress={() => {
                    navigation.navigate("TabNav");
                  }}
                >
                  <Ionicons color={"white"} name={"close"} size={32} />
                </CloseButton>
              </Camera>
            </Wrap>
          ) : null
        ) : (
          <ImageWrap>
            <Image style={{ flex: 1 }} source={{ uri: takenPhoto }} />
            <CloseButton
              onPress={() => {
                navigation.navigate("TabNav");
              }}
            >
              <Ionicons color={"white"} name={"close"} size={32} />
            </CloseButton>
          </ImageWrap>
        )}
      </CameraWrap>
      {takenPhoto === "" ? (
        <Action>
          <SlideContainer>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={0.1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255,255,255,0.4)"
              onValueChange={onChangeZoomValue}
            />
          </SlideContainer>
          <ButtonWrap>
            <FlipCameraButton onPress={cameraSwitch}>
              <Ionicons name="sync-outline" size={30} color={"white"} />
            </FlipCameraButton>
            <TakePhotoButton onPress={takePicture} />
            <ZoomCameraButton onPress={CameraFlash}>
              <Ionicons
                size={30}
                color="white"
                name={
                  flashType === Camera.Constants.FlashMode.off
                    ? "flash-off"
                    : flashType === Camera.Constants.FlashMode.on
                    ? "flash"
                    : flashType === Camera.Constants.FlashMode.auto
                    ? "eye"
                    : ""
                }
              />
            </ZoomCameraButton>
          </ButtonWrap>
        </Action>
      ) : (
        <Action>
          <PhotoActionButton onPress={onDismiss}>
            <PhotoActionText>Dismiss</PhotoActionText>
          </PhotoActionButton>
          <PhotoActionButton onPress={onUpload}>
            <PhotoActionText>Upload</PhotoActionText>
          </PhotoActionButton>
        </Action>
      )}
    </TakePhotoContainer>
  );
};
export default TakePhoto;
