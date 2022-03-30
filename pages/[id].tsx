import { CopyToClipboardWrapper, Flex, Menu, Text } from "juniper-ui/dist";
import { FirebaseContext } from "./_app";
import { onValue, ref, set } from "firebase/database";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import type { GroupData, Ratings } from "data.model";
import Results from "components/Results";
import ResponseForm from "components/ResponseForm";
import useSWR from "swr";

export default function GroupPage() {
  const db = useContext(FirebaseContext).db;
  const router = useRouter();
  const { id: rawId } = router.query;
  const groupId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isFillingOut, setIsFillingOut] = useState<boolean>(false);

  const {
    data: groupData,
    error,
    mutate,
  } = useSWR(`/api/groupData/${groupId}`, (...args) =>
    fetch(...args).then((res) => res.json()),
  );

  useEffect(() => {
    /**
     * Whenever the lastUpdate value changes, we revalidate
     * our groupData via api. Enabling us to have the latest
     * data when Firebase stuff changes AND having anonymized
     * data from our api.
     */
    onValue(ref(db, `${groupId}/lastUpdate`), () => {
      mutate({ ...groupData });
    });
  }, [mutate, groupId, db]);

  if (!!error) {
    router.push("/");
    return null;
  } else if (!groupData) {
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
    await set(ref(db, `${groupId}/lastUpdate`), new Date().getTime());
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
              Add Preferences
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
