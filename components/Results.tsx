import { Box, Flex, Grid, Text } from "juniper-ui/dist";
import styles from "styles/Results.module.scss";
import React from "react";
import { GroupData, Ratings } from "data.model";
import { sp } from "styles/utils";

const RatingOptions = Object.values(Ratings);

export default function Results({
  groupData,
}: {
  groupData: GroupData;
}): React.ReactElement | null {
  if (!groupData || !groupData.id) return null;

  const { warnings, responses } = groupData;

  const ratingMap: { [rating in Ratings]: number[] } = {
    [Ratings.G]: [],
    [Ratings.PG]: [],
    [Ratings["PG-13"]]: [],
    [Ratings["R"]]: [],
    [Ratings["NC-17"]]: [],
  };
  let allLines: string[] = [];
  let allVeils: string[] = [];

  for (const response of Object.values(responses || [])) {
    const { rating, lines, veils } = response;
    if (rating) {
      ratingMap[rating].push(1);
    }
    if (!!lines && Array.isArray(lines)) {
      allLines = allLines.concat(lines);
    }
    if (!!veils && Array.isArray(veils)) {
      allVeils = allVeils.concat(veils);
    }
  }
  // If a veil is already a line, don't show it
  allVeils = allVeils.filter((v) =>
    allLines.find((l) => l.toLowerCase() !== v.toLowerCase()),
  );

  return (
    <Flex col align="center" gap={sp("xxl")} className={styles.container}>
      {/* //* Warnings */}
      {!!warnings && (
        <Flex col align="center" gap={sp("sm")} className={styles.warnings}>
          <Text h3 margin={0}>
            ⚠️ Content Warnings
          </Text>
          <Text>{warnings}</Text>
        </Flex>
      )}

      {/* //* Ratings */}
      <Flex col align="center" gap={sp("sm")}>
        <Text h3 margin={0}>
          Rating
        </Text>
        <Text h5 margin={0} intent="secondary">
          If this game was a movie, it would be ideally rated
        </Text>
        <Grid colNum={5} gap={sp("sm")}>
          {RatingOptions.map((r) => (
            <Flex col key={r} align="center">
              <Text>{r}</Text>
              <Flex gap={sp("xs")} justify="center">
                {ratingMap[r].map((_, i) => (
                  <Box key={i} className={styles.ratingVote} />
                ))}
              </Flex>
            </Flex>
          ))}
        </Grid>
      </Flex>

      <Flex col align="center" width="100%">
        <Text h3>Topic Boundaries</Text>
        <Grid colNum={2} gap={sp("sm")} className={styles.topicsContainer}>
          {/* //* Lines */}
          <Flex col className={styles.veils}>
            <Text h3 color="yellow" margin={0}>
              ☁️ Veils
            </Text>
            <Text color="yellow" fontSize="var(--font-size-sm)">
              Topics that are soft limits, okay if veiled or offstage
            </Text>

            <Flex col marginTop={sp("sm")} wrap>
              {allVeils.map((v) => (
                <Text key={v}>{v}</Text>
              ))}
              {allVeils.length === 0 && <Text fontStyle="italic">-</Text>}
            </Flex>
          </Flex>

          {/* //* Veils */}
          <Flex col className={styles.lines}>
            <Text h3 color="red" margin={0}>
              ❌ Lines
            </Text>
            <Text color="red" fontSize="var(--font-size-sm)">
              Topics that are hard limits, not okay at all, including in
              reference
            </Text>

            <Flex col marginTop={sp("sm")} wrap>
              {allLines.map((l) => (
                <Text key={l}>{l}</Text>
              ))}
              {allLines.length === 0 && <Text fontStyle="italic">-</Text>}
            </Flex>
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  );
}
