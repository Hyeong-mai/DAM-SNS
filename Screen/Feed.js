import React, { useEffect, useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import ScreenLayout from "../Commponents/ScreenLayout";
import { FlatList, TouchableOpacity } from "react-native";
import Photo from "../Commponents/FeedPhoto";
import { FEED_QUERY } from "../GraphqlSQL/sql";
import Ionicons from "@expo/vector-icons/Ionicons";
import { tokenVar } from "../Apollo";

const Feed = ({ navigation }) => {
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderPhoto = ({ item: photo }) => {
    return <Photo {...photo} />;
  };
  const headerRightButton = () => {
    return (
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => {
          navigation.navigate("DM");
        }}
      >
        <Ionicons name="paper-plane-outline" size={20} color={"white"} />
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRightButton,
    });
  });
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
};
export default Feed;
