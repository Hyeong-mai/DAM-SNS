import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
  split,
  useReactiveVar,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};
export const logUserOut = async () => {
  // try {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar("");
  // } catch (exception) {
  //   console.log(exception);
  // }
  // client.resetStore();
};

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const uploadHttpLink = createUploadLink({
  uri: "https://1ec6-106-245-0-178.ngrok-free.app/graphql",
});

const httpLink = createHttpLink({
  uri: "https://1a0c-2001-e60-8756-9182-2043-4992-e5f8-b6fd.ngrok-free.app/graphql",
});

// const wsLink = new GraphQLWsLink(
//   createClient({
//     uri: "ws://16e1-183-100-195-5.ngrok-free.app/graphql",
//     options: {
//       connectionParams: () => ({ token: tokenVar() }),
//     },
//   })
// );

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("GraphQLError" + graphQLErrors);
  }
  if (networkError) {
    console.log("NetworkError" + networkError);
  }
});
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   httpLinks
// );
const link = authLink.concat(onErrorLink).concat(uploadHttpLink);
const links = authLink.concat(httpLink);
const client = new ApolloClient({
  link,
  cache,
});
export default client;
