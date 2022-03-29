import { Button, Flex, Menu, Text } from "juniper-ui/dist";
import { useState } from "react";
import { getUniqueCodename } from "lib/codenames";
import { sp } from "styles/utils";

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
    <Flex col gap={sp("md")} width="100%">
      <Menu horizontal justifyContent="center">
        <Menu.Item selected={isReturning} onClick={setTab(true)}>
          Returning
        </Menu.Item>
        <Menu.Item selected={!isReturning} onClick={setTab(false)}>
          New
        </Menu.Item>
      </Menu>

      {!isReturning && (
        <>
          <input
            id="codename"
            placeholder="Codename"
            readOnly
            value={newCodename}
          />
          <Flex gap={sp("sm")} width="100%">
            <Button
              color="blue"
              appearance="outline"
              onClick={handleRandomCodename}
              className="flexGrow"
            >
              New Codename
            </Button>
            <Button className="flexGrow2" onClick={() => onNew(newCodename)}>
              Register
            </Button>
          </Flex>
        </>
      )}

      {isReturning && (
        <>
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
        </>
      )}

      <Text fontSize="var(--font-size-md)">
        Codename is only used for this group.
        <br />
        Returning to edit? Use the same codename.
        <br />
        Codenames are randomly generated for anonymity.
      </Text>
    </Flex>
  );
}
