import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../Apollo";

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      avatar
    }
  }
`;

const UseMe = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
};
export default UseMe;
