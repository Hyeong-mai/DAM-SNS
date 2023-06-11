import React, { useState } from "react";
import { FlatList, View } from "react-native";
import ScreenLayout from "../Commponents/ScreenLayout";
import { useQuery } from "@apollo/client";
import UserRow from "../Commponents/UserRow";
import { LIKES_QUERY } from "../GraphqlSQL/sql";

const Like = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(LIKES_QUERY, {
    variables: {
      seePhotoLikeId: route?.params?.photoId,
    },
    skip: !route?.params?.photoId,
  });
  const renderUser = ({ item: user }) => <UserRow {...user} />;
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          ></View>
        }
        refreshing={refreshing}
        onRefresh={refresh}
        data={data?.seePhotoLike}
        keyExtractor={(item) => "" + item.id}
        style={{ width: "100%" }}
        renderItem={renderUser}
      />
    </ScreenLayout>
  );
};
export default Like;
