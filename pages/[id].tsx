import { Box, Button, Flex, Text } from "juniper-ui/dist";
import { FirebaseContext } from "./_app";
import { nanoid } from "nanoid";
import { ref, set } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import { useState } from "react";

export default function GroupPage() {
  const db = useContext(FirebaseContext).db;
  const router = useRouter();

  return (
    <>
      <Head>
        <title> | RPG Safety Tools</title>
      </Head>
      <Flex col align="center">
        <Text>Group</Text>
      </Flex>
    </>
  );
}
