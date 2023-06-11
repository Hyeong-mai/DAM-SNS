import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions, ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../Hooks/DismissKeyboard";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from "@apollo/client";

const SEARCH_QUERY = gql`
  query Query($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

const SearchContainer = styled.View`
  flex: 1;
  background-color: black;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;
const Input = styled.TextInput`
  color: white;
  width: ${(props) => props.width / 1.5}px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 10px;
  /* border: 1px solid rgba(255, 255, 255, 0.3); */
`;
const MessageContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const MessageText = styled.Text`
  color: white;
  font-weight: 900;
  margin-top: 20px;
`;
const ImageWrap = styled.TouchableOpacity``;
const Image = styled.Image`
  width: ${(props) => props.width / props.numColumns}px;
  height: ${(props) => props.width / props.numColumns}px;
  border-width: 0.7px;
`;
const Search = ({ navigation }) => {
  const numColumns = 3;
  const { width } = useWindowDimensions();
  const { register, setValue, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called, refetch }] =
    useLazyQuery(SEARCH_QUERY);
  const [focusVal, setFocusVal] = useState(false);
  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword,
      },
    });
  };
  const onFocus = () => {
    setFocusVal(true);
  };
  const onBlur = () => {
    setFocusVal(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const SearchInput = () => (
    <Input
      width={width}
      ref={keywordRef}
      placeholder="Search"
      placeholderTextColor={"rgba(255,255,255,0.3)"}
      returnKeyLabel="Search"
      returnKeyType="search"
      autoCapitalize="none"
      autoCorrect={false}
      onChangeText={(text) => {
        setValue("keyword", text);
      }}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );
  const keywordRef = useRef();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchInput,
    });
    register("keyword", {
      required: true,
      minLength: "3",
    });
  });
  const renderItem = ({ item: photo }) => (
    <ImageWrap
      onPress={() => {
        navigation.navigate("Photo", {
          id: photo.id,
        });
      }}
    >
      <Image
        source={{ uri: photo.file }}
        width={width}
        numColumns={numColumns}
      />
    </ImageWrap>
  );

  return (
    <DismissKeyboard>
      <SearchContainer>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size={"large"} />
            <MessageText>검색중...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>검색어를 입력하세요</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchPhotos !== undefined ? (
          data?.searchPhotos.length === 0 ? (
            <MessageContainer>
              <MessageText>검색 결과가 없습니다.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              style={{ flex: 1 }}
              refreshing={refreshing}
              onRefresh={refresh}
              numColumns={numColumns}
              data={data?.searchPhotos}
              keyExtractor={(photo) => "" + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </SearchContainer>
    </DismissKeyboard>
  );
};
export default Search;
