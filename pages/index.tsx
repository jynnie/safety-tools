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
    <div className={styles.container}>
      <Head>
        <title>RPG Safety Tools</title>
        <meta
          name="description"
          content="Safety tools, like lines and veils, for TTRPG campaigns. Easy and anonymous."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Text h1>Safety Tools</Text>
        <Text secondary>
          Playing an RPG? Quickly set up anonymous lines {"&"} veils for your
          group.
        </Text>

        <Divider lg />

        <Flex col gap="var(--sp-sm)" width={300}>
          <input
            placeholder="New Group Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box>
            <Text h5 intent="secondary" margin={0}>
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

      <footer className={styles.footer}>Powered by 哪吒</footer>
    </div>
  );
};

export default NewToolkit;
