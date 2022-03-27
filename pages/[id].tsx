import {
  Button,
  CopyToClipboardWrapper,
  Divider,
  Flex,
  Text,
} from "juniper-ui/dist";
import { FirebaseContext } from "./_app";
import { onValue, ref } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Group.module.scss";
import { useState, useEffect } from "react";
import type { GroupData } from "data.model";
import Results from "components/Results";
import ResponseForm from "components/ResponseForm";

const NO_GROUP_ERROR = Error("No group found from id");

export default function GroupPage() {
  const db = useContext(FirebaseContext).db;
  const router = useRouter();
  const { id: rawId, view } = router.query;
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
    return <>Loading...</>;
  }

  const { name, id } = groupData as GroupData;
  const link = `${document.location.protocol}//${document.location.host}/${id}`;

  return (
    <>
      <Head>
        <title>{name} | RPG Safety Tools</title>
      </Head>
      <Flex col align="center" className={styles.container}>
        <CopyToClipboardWrapper value={link}>
          <Text h2 className={styles.groupName}>
            {name}
          </Text>
        </CopyToClipboardWrapper>
        <Text secondary>
          Anonymously communicate your comfort with various content topics and
          themes that could show up in play.
        </Text>
        <Divider xl />

        <Flex col gap="var(--sp-xxl)" width="100%">
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
              <ResponseForm />
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
}
