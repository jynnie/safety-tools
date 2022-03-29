import { Text } from "juniper-ui/dist";
import Head from "next/head";
import type { NextPage } from "next";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>RPG Safety Tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <div className="content">
          <Text h1>Safety Tools</Text>
          <Text p secondary>
            Safety Tools helps you quickly and easily set up anonymous lines{" "}
            {"&"} veils for your play group. Just create a group and share the
            link.
          </Text>
          <Text p secondary>
            We suggest common themes and topics that may be sensitive for
            players to consider.
          </Text>
          <Text p secondary>
            Based off the RPG Safety Toolkit {"&"} the RPG Consent Checklist.
          </Text>
        </div>
      </main>
    </>
  );
};

export default About;
