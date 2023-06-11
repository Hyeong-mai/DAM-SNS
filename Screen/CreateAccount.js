import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import AuthLayout from "../Commponents/Auth/AuthLayout";
import AuthButton from "../Commponents/Auth/AuthButton";
import { AuthInput } from "../Commponents/Auth/AuthInput";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount(
    $firstName: String!
    $username: String!
    $email: String!
    $password: String!
    $lastName: String
  ) {
    createAccount(
      firstName: $firstName
      username: $username
      email: $email
      password: $password
      lastName: $lastName
    ) {
      ok
    }
  }
`;
const CreateAccount = ({ navigation }) => {
  const { register, setValue, handleSubmit, watch, getValues } = useForm();
  const onCompleted = ({ createAccount: { ok, error } }) => {
    if (!ok) {
      alert(error);
      return;
    }
    const { username, password } = getValues();
    navigation.navigate("Login", {
      username,
      password,
    });
  };
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const OnNext = (NextOne) => {
    NextOne?.current?.focus();
  };
  const onValid = (data) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };
  useEffect(() => {
    register("firstName"),
      register("lastName"),
      register("username"),
      register("email"),
      register("password");
  }, [register]);
  return (
    <AuthLayout>
      <AuthInput
        returnKeyType="next"
        placeholder="First Name"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onSubmitEditing={() => OnNext(lastNameRef)}
        onChangeText={(text) => {
          setValue("firstName", text);
        }}
      />
      <AuthInput
        ref={lastNameRef}
        returnKeyType="next"
        placeholder="Last Name"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onSubmitEditing={() => OnNext(usernameRef)}
        onChangeText={(text) => {
          setValue("lastName", text);
        }}
      />
      <AuthInput
        ref={usernameRef}
        returnKeyType="next"
        placeholder="Username"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onSubmitEditing={() => OnNext(emailRef)}
        onChangeText={(text) => {
          setValue("username", text);
        }}
      />
      <AuthInput
        ref={emailRef}
        returnKeyType="next"
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onSubmitEditing={() => OnNext(passwordRef)}
        onChangeText={(text) => {
          setValue("email", text);
        }}
      />
      <AuthInput
        ref={passwordRef}
        returnKeyType="done"
        placeholder="Password"
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
        onEndEditing={handleSubmit(onValid)}
        onChangeText={(text) => {
          setValue("password", text);
        }}
        lastOne={true}
        secureTextEntry
      />

      <AuthButton
        text={"Create Account"}
        disabled={
          !watch("firstName") ||
          !watch("lastName") ||
          !watch("username") ||
          !watch("email") ||
          !watch("password")
        }
        onPress={handleSubmit(onValid)}
        loading={loading}
      />
    </AuthLayout>
  );
};
export default CreateAccount;
