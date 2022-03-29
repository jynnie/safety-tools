import { CopyToClipboardWrapper, Flex, Menu, Text } from "juniper-ui/dist";
import { FirebaseContext } from "./_app";
import { onValue, ref, set } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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

  const [isCopying, setIsCopying] = useState<boolean>(false);
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

  function handleClickCopy() {
    setIsCopying(true);
    setTimeout(() => {
      setIsCopying(false);
    }, 2000);
  }

  // FIXME: This feels super insecure
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <div className="content">
          <Text h2>{name}</Text>
          <Menu horizontal>
            <Menu.Item
              selected={isFillingOut}
              onClick={() => setIsFillingOut(!isFillingOut)}
            >
              Your Preferences
            </Menu.Item>
            <CopyToClipboardWrapper value={link}>
              <Menu.Item onClick={handleClickCopy}>
                {isCopying ? "Copied" : "Link"}
              </Menu.Item>
            </CopyToClipboardWrapper>
          </Menu>
        </div>

        <Flex className="content slide" col gap="var(--sp-xxl)">
          {!isFillingOut && <Results groupData={groupData as GroupData} />}

          {isFillingOut && (
            <ResponseForm
              {...{ groupData: groupData as GroupData, onSave: handleSave }}
            />
          )}
        </Flex>
      </main>
    </>
  );
}
