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
import { Database, onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Group.module.scss";
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import type { GroupData, Ratings } from "data.model";
import Results from "components/Results";
import { getUniqueCodename } from "lib/codenames";
import SignInStep from "./SignInStep";
import ResponseStep from "./ResponseStep";
import { sp } from "styles/utils";

export default function ResponseForm({
  groupData,
  onSave,
}: {
  groupData: GroupData;
  onSave: (
    codename: string,
    rating: Ratings | null,
    lines: string[],
    veils: string[],
  ) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [codename, setCodename] = useState<string>("");

  const usedCodenames = Object.values(groupData?.codenames || []);

  function handleNew(codename: string) {
    setCodename(codename);
    setIsLoggedIn(true);
  }

  function handleReturning(codename: string) {
    if (usedCodenames.includes(codename)) {
      setCodename(codename);
      setIsLoggedIn(true);
    }
  }

  function handleSave(
    rating: Ratings | null,
    lines: string[],
    veils: string[],
  ) {
    if (isLoggedIn && codename) {
      onSave?.(codename, rating, lines, veils);
    }
  }

  return (
    <Flex col align="center" gap={sp("sm")}>
      {!isLoggedIn && (
        <SignInStep {...{ usedCodenames, handleNew, handleReturning }} />
      )}
      {!!isLoggedIn && (
        <ResponseStep {...{ groupData, codename, onSave: handleSave }} />
      )}
    </Flex>
  );
}
