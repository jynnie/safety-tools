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

  const usedCodenames = Object.values(groupData?.codenames || []);

  function handleNew(codename: string) {
    setCodename(codename);
    setIsLoggedIn(true);
  }

  function handleReturning(codename: string) {
    if (usedCodenames.includes(codename)) {
      setCodename(codename);
      setIsLoggedIn(true);
    }
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
        <SignInStep {...{ usedCodenames, handleNew, handleReturning }} />
      )}
      {!!isLoggedIn && (
        <ResponseStep {...{ groupData, codename, onSave: handleSave }} />
      )}
    </Flex>
  );
}
