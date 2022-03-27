import {
  Box,
  Button,
  CopyToClipboardWrapper,
  Divider,
  Flex,
  Menu,
  Text,
} from "juniper-ui/dist";
import { nanoid } from "nanoid";
import { onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Group.module.scss";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import type { GroupData } from "data.model";
import Results from "components/Results";
import { getUniqueCodename } from "lib/codenames";
import SignInForm from "./SignInForm";

export default function ResponseForm() {
  const usedCodenames: string[] = [];

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [codename, setCodename] = useState<string>("");

  function handleNew(codename: string) {
    setCodename(codename);
    setIsLoggedIn(true);
  }
  function handleReturning(codename: string) {
    if (usedCodenames.includes(codename)) {
      setIsLoggedIn(true);
    }
  }

  return (
    <Flex col align="center" gap="var(--sp-sm)">
      {!isLoggedIn && (
        <SignInForm {...{ usedCodenames, handleNew, handleReturning }} />
      )}
    </Flex>
  );
}
