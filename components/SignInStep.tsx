import { Box, Button, Flex, Menu, Text } from "juniper-ui/dist";
import { useState } from "react";
import { getUniqueCodename } from "lib/codenames";

export default function SignInStep({
  usedCodenames,
  handleNew,
  handleReturning,
}: {
  usedCodenames: string[];
  handleNew: (codename: string) => void;
  handleReturning: (codename: string) => void;
}) {
  const [isReturning, setIsReturning] = useState<boolean>(true);
  const [returningCodename, setReturningCodename] = useState<string>("");
  const [newCodename, setNewCodename] = useState<string>(
    getUniqueCodename(usedCodenames),
  );

  function handleRandomCodename() {
    setNewCodename(getUniqueCodename(usedCodenames));
  }

  return (
    <Flex col align="center" gap="var(--sp-sm)">
      <Menu horizontal>
        <Menu.Item selected={isReturning} onClick={() => setIsReturning(true)}>
          Returning
        </Menu.Item>
        <Menu.Item
          selected={!isReturning}
          onClick={() => setIsReturning(false)}
        >
          New
        </Menu.Item>
      </Menu>

      <Flex col align="center" gap="var(--sp-sm)">
        {!isReturning && (
          <>
            <input
              id="codename"
              placeholder="Codename"
              readOnly
              value={newCodename}
            />
            <Flex gap="var(--sp-xs)">
              <Button
                color="blue"
                appearance="outline"
                onClick={handleRandomCodename}
              >
                New Codename
              </Button>
              <Button onClick={() => handleNew(newCodename)}>Register</Button>
            </Flex>
          </>
        )}

        {isReturning && (
          <Flex col gap="var(--sp-sm)">
            <input
              id="codename"
              placeholder="Codename"
              value={returningCodename}
              onChange={(e) => setReturningCodename(e.target.value)}
            />
            <Button onClick={() => handleReturning(returningCodename)}>
              Sign In
            </Button>
          </Flex>
        )}

        <Text textAlign="center" fontSize="var(--font-size-sm)">
          Codename is only used for this group.
          <br />
          Returning to edit? Use the same codename.
          <br />
          Codenames are randomly generated for anonymity.
        </Text>
      </Flex>
    </Flex>
  );
}
