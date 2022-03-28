import { Box, Button, Divider, Flex, Text } from "juniper-ui/dist";
import { FirebaseContext } from "./_app";
import { nanoid } from "nanoid";
import { ref, set } from "firebase/database";
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import { useState } from "react";
import { sp } from "styles/utils";

const NewToolkit: NextPage = () => {
  const db = useContext(FirebaseContext).db;
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [warnings, setWarnings] = useState<string>("");
  const [error, setError] = useState<null | string>(null);

  async function handleCreate() {
    const id = nanoid();

    if (!name) {
      setError("Missing required field: Group Name");
      return;
    }

    await set(ref(db, id), {
      id,
      name,
      warnings,
    });
    router.push(`/${id}`);
  }

  return (
    <>
      <Head>
        <title>RPG Safety Tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <div className="content">
          <Text h1>Safety Tools</Text>
          <Text secondary>
            Playing a RPG? Quickly set up{" "}
            <Text span bold>
              anonymous lines {"&"} veils
            </Text>{" "}
            for your group to communicate comfort with various content topics
            and themes that could show up in play.
          </Text>
        </div>

        <Flex col gap={sp("md")} className="slide">
          <Text h2 margin={0}>
            Get Started
          </Text>

          <input
            placeholder="New Group Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box>
            <Text h5 intent="secondary" marginBottom={sp("sm")}>
              Content Warnings
            </Text>
            <textarea
              className={styles.warnings}
              placeholder="Warnings you want to share upfront with your group."
              value={warnings}
              onChange={(e) => setWarnings(e.target.value)}
            />
            {!!error && (
              <Text color="red" intent="danger">
                {error}
              </Text>
            )}
          </Box>

          <Button onClick={handleCreate}>Create</Button>
        </Flex>
      </main>
    </>
  );
};

export default NewToolkit;
