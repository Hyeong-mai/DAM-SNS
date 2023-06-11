import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import MessagesItem from "../Commponents/MessageItem";
import { FlatList, KeyboardAvoidingView } from "react-native";
import ScreenLayout from "../Commponents/ScreenLayout";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import UseMe from "../Hooks/UseMe";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../Colors";

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($payLoad: String!, $roomId: Int) {
    sendMessage(payLoad: $payLoad, roomId: $roomId) {
      ok
      id
    }
  }
`;
const READ_MESSAGE = gql`
  mutation readMessage($readMessageId: Int!) {
    readMessage(id: $readMessageId) {
      ok
    }
  }
`;
// const ROOM_UPDATES = gql`
//   subscription roomUpdates($roomUpdatesId: Int!) {
//     roomUpdates(id: $roomUpdatesId) {
//       id
//       payLoad
//       user {
//         username
//         avatar
//       }
//       read
//     }
//   }
// `;

const SEE_ROOM_QUERY = gql`
  query SeeRoom($id: Int!) {
    seeRoom(id: $id) {
      messages {
        id
        payLoad
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;
const InputWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  border-radius: 1000px;
  padding: 0px 15px;
`;
const TextInput = styled.TextInput`
  width: 80%;
  padding: 10px 0px;
  color: white;
`;
const SendButton = styled.TouchableOpacity``;
const HeaderContainer = styled.View`
  width: 100%;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;
const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: tomato;
  margin-bottom: 20px;
`;
const Username = styled.Text`
  font-weight: 900;
  font-size: 18px;
  color: white;
  margin-bottom: 20px;
`;
const ProfileButton = styled.TouchableOpacity`
  padding: 10px 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 12px;
`;
const DMRoom = ({ navigation, route }) => {
  const { data: meData } = UseMe();
  const { handleSubmit, setValue, getValues, register, watch } = useForm();
  const [refreshing, setRefreshing] = useState(false);
  const [inRoom, setInRoom] = useState(true);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const { data, loading, refetch } = useQuery(SEE_ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  // const client = useApolloClient();
  // const updateQuery = (prevQuery, options) => {
  //   const {
  //     subscriptionData: {
  //       data: { roomUpdates: message },
  //     },
  //   } = options;
  //   if (message.id) {
  //     const incomingMessage = client.cache.writeFragment({
  //       fragment: gql`
  //         fragment NewMessage on Message {
  //           id
  //           payLoad
  //           user {
  //             username
  //             avatar
  //           }
  //           read
  //         }
  //       `,
  //       data: message,
  //     });
  //     client.cache.modify({
  //       id: `Room:${route.params.id}`,
  //       fields: {
  //         messages(prev) {
  //           const existingMessage = prev.find(
  //             (aMessage) => aMessage.__ref === incomingMessage.__ref
  //           );
  //           if (existingMessage) {
  //             return prev;
  //           }
  //           return [...prev, incomingMessage];
  //         },
  //       },
  //     });
  //   }
  // };
  // useEffect(() => {
  // if (data?.seeRoom && !subscribed) {
  //   console.log("in");
  //   subscribeToMore({
  //     document: ROOM_UPDATES,
  //   });
  //   setSubscribed(true);
  // }

  // }, []);
  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        payLoad: message,
        user: {
          username: meData.me.username,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: "Message",
      };
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payLoad
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });
      cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  // const updateReadMessage = (cache, result) => {
  //   // console.log(result);
  // };
  const [readMessage, { loading: readMessageLoading }] = useMutation(
    READ_MESSAGE,
    {
      // update: updateReadMessage,
    }
  );
  const messages = [...(data?.seeRoom?.messages ?? [])];
  const seeMsg = () => {
    if (inRoom) {
      const noReadMsg = messages.filter(
        (message) =>
          message?.user?.username !== meData?.username &&
          message?.read === false
      );
      noReadMsg.map((message) => {
        readMessage({
          variables: {
            readMessageId: message.id,
          },
        });
      });
    }
  };
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );
  const [ContainerHeight, setContainerHeight] = useState();

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height + 40);
  };
  const renderItem = ({ item: message }) => (
    <MessagesItem message={message} notMe={route?.params?.notMe} />
  );
  const onValid = (data) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payLoad: data?.message,
          roomId: route?.params?.id,
        },
      });
    }
  };
  useEffect(() => {
    setInRoom(true);

    register("message", {
      required: true,
    });
    seeMsg();
  }, [register]);
  const headerComponent = () => {
    return (
      <HeaderContainer>
        <Avatar source={{ uri: route?.params?.notMe?.avatar }} />
        <Username>{route?.params?.notMe?.username}</Username>
        <ProfileButton>
          <ButtonText>프로필 보기</ButtonText>
        </ProfileButton>
      </HeaderContainer>
    );
  };
  let renderMessage = [...(data?.seeRoom?.messages ?? [])];
  // renderMessage.reverse();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior="padding"
      keyboardVerticalOffset={ContainerHeight}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          refreshing={refreshing}
          onRefresh={refresh}
          inverted
          ListFooterComponent={headerComponent}
          style={{ width: "100%", flex: 1, padding: 10 }}
          data={renderMessage}
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <InputWrap>
          <TextInput
            value={watch("message")}
            onLayout={onLayout}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            placeholder="Write a message..."
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onEndEditing={handleSubmit(onValid)}
            onChangeText={(text) => {
              setValue("message", text);
            }}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("message"))}
          >
            <Ionicons
              name="paper-plane-outline"
              size={20}
              color={
                !Boolean(watch("message"))
                  ? "rgba(255,255,255,0.3)"
                  : colors.blue
              }
            />
          </SendButton>
        </InputWrap>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};

export default DMRoom;
