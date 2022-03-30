import { Text } from "juniper-ui/dist";
import Head from "next/head";
import type { NextPage } from "next";

const SAFETY_TOOLKIT_LINK =
  "https://drive.google.com/drive/folders/114jRmhzBpdqkAlhmveis0nmW73qkAZCj";

const RPG_CONSENT_CHECKLIST_LINK =
  "https://mcpl.info/sites/default/files/images/consent-in-gaming-form-fillable-checklist-2019-09-13.pdf";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>RPG Safety Tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <div className="about content">
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
            Based off the{" "}
            <a href={SAFETY_TOOLKIT_LINK} target="_blank" rel="noreferrer">
              RPG Safety Toolkit
            </a>{" "}
            {"&"} the{" "}
            <a
              href={RPG_CONSENT_CHECKLIST_LINK}
              target="_blank"
              rel="noreferrer"
            >
              RPG Consent Checklist
            </a>
            . Credits to the wonderful folks who have worked on these and the
            many other safety tools out there.
          </Text>
        </div>
      </main>
    </>
  );
};

export default About;
