import { Box, Button, Flex, Menu, Text } from "juniper-ui/dist";
import { useState } from "react";
import { getUniqueCodename } from "lib/codenames";

export default function SignInStep({
  usedCodenames,
  onNew,
  onReturning,
}: {
  usedCodenames: string[];
  onNew: (codename: string) => void;
  onReturning: (codename: string) => boolean;
}) {
  const [isReturning, setIsReturning] = useState<boolean>(true);
  const [returningCodename, setReturningCodename] = useState<string>("");
  const [newCodename, setNewCodename] = useState<string>(
    getUniqueCodename(usedCodenames),
  );
  const [error, setError] = useState<null | string>(null);

  function handleRandomCodename() {
    setNewCodename(getUniqueCodename(usedCodenames));
  }

  const setTab = (value: boolean) => () => {
    setIsReturning(value);
    setError(null);
  };

  function handleReturning(codename: string) {
    const res = onReturning(codename);
    if (!res) setError("No one here goes by that");
  }

  return (
    <Flex col align="center" gap="var(--sp-sm)">
      <Menu horizontal>
        <Menu.Item selected={isReturning} onClick={setTab(true)}>
          Returning
        </Menu.Item>
        <Menu.Item selected={!isReturning} onClick={setTab(false)}>
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
              <Button onClick={() => onNew(newCodename)}>Register</Button>
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
            {!!error && (
              <Text color="red" intent="danger">
                {error}
              </Text>
            )}
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
