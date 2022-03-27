import {
  Button,
  CopyToClipboardWrapper,
  Divider,
  Flex,
  Text,
} from "juniper-ui/dist";
import { FirebaseContext } from "./_app";
import { onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Group.module.scss";
import { useState, useEffect } from "react";
import type { GroupData, Ratings } from "data.model";
import Results from "components/Results";
import ResponseForm from "components/ResponseForm";

const NO_GROUP_ERROR = Error("No group found from id");

export default function GroupPage() {
  const db = useContext(FirebaseContext).db;
  const router = useRouter();
  const { id: rawId } = router.query;
  const groupId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [isFillingOut, setIsFillingOut] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<
    GroupData | typeof NO_GROUP_ERROR | undefined
  >(undefined);

  useEffect(() => {
    onValue(ref(db, groupId), (snapshot) => {
      const rawValue = snapshot.val() || NO_GROUP_ERROR;
      setGroupData(rawValue);
    });
  }, [db, groupId]);

  if (groupData === NO_GROUP_ERROR) {
    router.push("/");
    return;
  } else if (groupData === undefined) {
    return (
      <Flex width="100vw" height="100vh" center>
        Loading...
      </Flex>
    );
  }

  const { name, id } = groupData as GroupData;
  const link = `${document.location.protocol}//${document.location.host}/${id}`;

  async function handleSave(
    codename: string,
    rating: Ratings | null,
    lines: string[],
    veils: string[],
  ) {
    await set(ref(db, `${groupId}/responses/${codename}`), {
      rating,
      lines,
      veils,
    });
    await set(ref(db, `${groupId}/codenames/${codename}`), codename);
    setIsFillingOut(false);
  }

  return (
    <>
      <Head>
        <title>{name} | RPG Safety Tools</title>
      </Head>
      <Flex col className={styles.container}>
        <Text h2 textAlign="center">
          {name}
        </Text>
        <Text secondary>
          Anonymously communicate your comfort with various content topics and
          themes that could show up in play.
        </Text>
        <Text secondary>
          Invite players to fill this out by sending the{" "}
          <CopyToClipboardWrapper value={link}>
            <Text is="span" color="blue" className={styles.groupName}>
              link
            </Text>
          </CopyToClipboardWrapper>{" "}
          to this page.
        </Text>
        <Divider xl />

        <Flex col gap="var(--sp-xxl)" width="100%" align="center">
          {!isFillingOut && (
            <>
              <Button intent="secondary" onClick={() => setIsFillingOut(true)}>
                Fill Out Your Preferences
              </Button>
              <Results groupData={groupData as GroupData} />
            </>
          )}

          {isFillingOut && (
            <>
              <Button intent="secondary" onClick={() => setIsFillingOut(false)}>
                Back
              </Button>
              <ResponseForm
                {...{ groupData: groupData as GroupData, onSave: handleSave }}
              />
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
}
