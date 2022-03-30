import { Flex } from "juniper-ui/dist";
import { useState } from "react";
import type { GroupData, Ratings } from "data.model";
import SignInStep from "./SignInStep";
import ResponseStep from "./ResponseStep";
import { sp } from "styles/utils";

export default function ResponseForm({
  groupData,
  onSave,
}: {
  groupData: GroupData;
  onSave: (
    codename: string,
    rating: Ratings | null,
    lines: string[],
    veils: string[],
  ) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [codename, setCodename] = useState<string>("");

  async function handleNew(codename: string) {
    await fetch(`/api/newCodename`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: groupData.id,
        codename,
      }),
    })
      .then((response) => response.ok)
      .then((isOk) => {
        if (isOk) {
          setCodename(codename);
          setIsLoggedIn(true);
        } else {
          console.error("Unable to make a new codename.");
        }
      });
  }

  async function handleReturning(codename: string) {
    return fetch(
      `/api/checkCodename?groupId=${groupData.id}&codename=${codename}`,
    ).then(async (response) => {
      if (!response.ok) return false;

      const { isValid } = await response.json();
      if (!!isValid) {
        setCodename(codename);
        setIsLoggedIn(true);
        return true;
      } else {
        return false;
      }
    });
  }

  function handleSave(
    rating: Ratings | null,
    lines: string[],
    veils: string[],
  ) {
    if (isLoggedIn && codename) {
      onSave?.(codename, rating, lines, veils);
    }
  }

  return (
    <Flex col align="center" gap={sp("sm")}>
      {!isLoggedIn && (
        <SignInStep {...{ onNew: handleNew, onReturning: handleReturning }} />
      )}
      {!!isLoggedIn && (
        <ResponseStep
          {...{ groupId: groupData.id, codename, onSave: handleSave }}
        />
      )}
    </Flex>
  );
}
