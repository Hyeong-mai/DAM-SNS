import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import ScreenLayout from "../Commponents/ScreenLayout";
import { FlatList, Image, View } from "react-native";
import styled from "styled-components/native";
import UseMe from "../Hooks/UseMe";
import { colors } from "../Colors";
import DMItem from "../Commponents/DMItem";

const SEE_ROOMS_QUERY = gql`
  query SeeRoom {
    seeRooms {
      id
      unreadTotal
      user {
        username
        avatar
      }
      messages {
        payLoad
      }
    }
  }
`;

const DMList = () => {
  const { data, loading, refetch } = useQuery(SEE_ROOMS_QUERY);
  const renderRoom = ({ item: room }) => {
    return <DMItem room={room} />;
  };

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        style={{
          flex: 1,
          width: "100%",
        }}
        data={data?.seeRooms}
        key={(Room) => "" + Room.id}
        renderItem={renderRoom}
      />
    </ScreenLayout>
  );
};

export default DMList;
