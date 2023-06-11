import React, { useEffect, useRef } from "react";
import AuthLayout from "../Commponents/Auth/AuthLayout";
import AuthButton from "../Commponents/Auth/AuthButton";
import { AuthInput } from "../Commponents/Auth/AuthInput";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../Apollo";

const LOG_IN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      error
      ok
      token
    }
  }
`;

const Login = ({ route: { params } }) => {
  const { register, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      password: params?.password,
      username: params?.username,
    },
  });
  const onCompleted = async (data) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      await logUserIn(token);
    }
  };
  const [logInMutation, { loading }] = useMutation(LOG_IN_MUTATION, {
    onCompleted,
  });
  const usernameRef = useRef();
  const passwordRef = useRef();
  const onNext = (refName) => {
    refName?.current?.focus();
  };
  useEffect(() => {
    register("username"), register("password");
  }, [register]);
  const onValid = (data) => {
    if (!loading) {
      logInMutation({
        variables: {
          ...data,
        },
      });
    }
  };
  return (
    <AuthLayout>
      <AuthInput
        value={watch("username")}
        ref={usernameRef}
        returnKeyType="done"
        name={"username"}
        placeholder="Username"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onEndEditing={() => onNext(passwordRef)}
        autoCapitalize="none"
        onChangeText={(text) => {
          setValue("username", text);
        }}
      />
      <AuthInput
        value={watch("password")}
        ref={passwordRef}
        returnKeyType="done"
        name={"password"}
        placeholder="Password"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onEndEditing={handleSubmit(onValid)}
        lastOne={true}
        secureTextEntry
        onChangeText={(text) => {
          setValue("password", text);
        }}
      />
      <AuthButton
        text={"Log In"}
        disabled={!watch("username") || !watch("password")}
        loading={loading}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
};
export default Login;
