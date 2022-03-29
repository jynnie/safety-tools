import { Box, Flex, Grid, Text } from "juniper-ui/dist";
import styles from "styles/Results.module.scss";
import React from "react";
import { GroupData, Ratings } from "data.model";
import { sp } from "styles/utils";
import cn from "classnames";
import { AlertOctagon, AlertTriangle, XOctagon } from "react-feather";

const RatingOptions = Object.values(Ratings);

export default function Results({
  groupData,
}: {
  groupData: GroupData;
}): React.ReactElement | null {
  if (!groupData || !groupData.id) return null;

  const { warnings, responses } = groupData;

  const ratingMap: { [rating in Ratings]: number } = {
    [Ratings.G]: 0,
    [Ratings.PG]: 0,
    [Ratings["PG-13"]]: 0,
    [Ratings["R"]]: 0,
    [Ratings["NC-17"]]: 0,
  };
  let allLines: string[] = [];
  let allVeils: string[] = [];

  for (const response of Object.values(responses || [])) {
    const { rating, lines, veils } = response;
    if (rating) {
      ratingMap[rating] += 1;
    }
    if (!!lines && Array.isArray(lines)) {
      allLines = allLines.concat(lines);
    }
    if (!!veils && Array.isArray(veils)) {
      allVeils = allVeils.concat(veils);
    }
  }
  // If a veil is already a line, don't show it
  allVeils = allVeils.filter(
    (v) => !allLines.find((l) => l.toLowerCase() === v.toLowerCase()),
  );

  return (
    <Flex col align="flex-start" gap={sp("xxxl")}>
      {/* //* Warnings */}
      {!!warnings && (
        <Flex col gap={sp("md")}>
          <Text h4 margin={0}>
            Content Warnings
          </Text>
          <Text>{warnings}</Text>
        </Flex>
      )}

      {/* //* Ratings */}
      <Flex col gap={sp("md")}>
        <Text h4 margin={0}>
          Rating
        </Text>
        <Text>If this game was a movie, it would be ideally rated</Text>
        <Grid colNum={5} gap={sp("sm")}>
          {RatingOptions.map((r) => (
            <Flex
              className={cn("ratingOption", { isVoted: ratingMap[r] > 0 })}
              key={r}
            >
              <Text bold>{r}</Text>
              <Text fontSize="var(--font-size-lg)">{ratingMap[r] || "-"}</Text>
            </Flex>
          ))}
        </Grid>
      </Flex>

      <Flex col>
        <Text h4>Topic Boundaries</Text>
        <Grid gap={sp("md")} className={styles.topicsContainer}>
          {/* //* Lines */}
          <Flex col className={styles.veils}>
            <Flex align="center" gap={sp("xs")}>
              <AlertTriangle />
              <Text h4 margin={0}>
                Veils
              </Text>
            </Flex>
            <Text fontSize="var(--font-size-sm)">
              Topics that are soft limits, okay if veiled or offstage
            </Text>

            <Flex col is="ul" marginTop={sp("sm")}>
              {allVeils.map((v) => (
                <Text key={v} is="li">
                  {v}
                </Text>
              ))}
              {allVeils.length === 0 && <Text fontStyle="italic">-</Text>}
            </Flex>
          </Flex>

          {/* //* Veils */}
          <Flex col className={styles.lines}>
            <Flex align="center" gap={sp("xs")}>
              <XOctagon />
              <Text h4 margin={0}>
                Lines
              </Text>
            </Flex>
            <Text fontSize="var(--font-size-sm)">
              Topics that are hard limits, not okay at all, including in
              reference
            </Text>

            <Flex col is="ul" marginTop={sp("sm")}>
              {allLines.map((l) => (
                <Text key={l} is="li">
                  {l}
                </Text>
              ))}
              {allLines.length === 0 && <Text fontStyle="italic">-</Text>}
            </Flex>
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  );
}
