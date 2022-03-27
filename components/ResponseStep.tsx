import { Button, Divider, Flex, Grid, Menu, Text } from "juniper-ui/dist";
import { useState } from "react";
import { getUniqueCodename } from "lib/codenames";
import { GroupData, Ratings } from "data.model";
import { useContext } from "react";
import { FirebaseContext } from "pages/_app";
import { useEffect } from "react";
import styles from "styles/Results.module.scss";
import { sp } from "styles/utils";
import { TOPICS, TOPICS_CLOSED_BY_DEFAULT } from "lib/topics";

const RatingOptions = Object.values(Ratings);
const TopicKeys = Object.keys(TOPICS);

function Topic({
  topicName,
  isHeader,
  onOkay,
  onVeil,
  onLine,
}: {
  topicName?: string;
  isHeader?: boolean;
  onOkay?: () => void;
  onVeil?: () => void;
  onLine?: () => void;
}) {
  return (
    <Flex flexGrow={1} className={styles.topic} align="center">
      <Text flexGrow={1} bold={!!isHeader}>
        {topicName}
      </Text>
      {onVeil && (
        <Button
          className={styles.minimal}
          appearance="minimal"
          onClick={onVeil}
        >
          ☁️
        </Button>
      )}
      {onLine && (
        <Button
          className={styles.minimal}
          appearance="minimal"
          onClick={onLine}
        >
          ❌
        </Button>
      )}
      {onOkay && (
        <Button
          className={styles.minimal}
          appearance="minimal"
          onClick={onOkay}
        >
          ✅
        </Button>
      )}
    </Flex>
  );
}

function Collapsible({
  className,
  header,
  defaultShow = false,
  children,
}: {
  className?: string;
  header?: React.ReactElement;
  defaultShow?: boolean;
  children?: any;
}) {
  const [show, setShow] = useState<boolean>(defaultShow ?? false);
  return (
    <Flex col className={className}>
      <Flex align="center">
        <Button
          className={styles.minimal}
          appearance="minimal"
          onClick={() => setShow(!show)}
        >
          {show ? "🔽" : "▶️"}
        </Button>
        {header}
      </Flex>
      {show && (
        <Flex col marginLeft="var(--sp-xxl)">
          {children}
        </Flex>
      )}
    </Flex>
  );
}

function MajorTopic({
  topic,
  handleVeil,
  handleLine,
  veils,
  lines,
}: {
  topic: string;
  handleVeil?: (topic: string) => () => void;
  handleLine?: (topic: string) => () => void;
  veils: string[];
  lines: string[];
}) {
  if (veils.includes(topic) || lines.includes(topic)) return null;
  return (
    <Collapsible
      className={styles.topicContainer}
      header={
        <Topic
          topicName={topic}
          isHeader
          onLine={handleLine?.(topic)}
          onVeil={handleVeil?.(topic)}
        />
      }
      defaultShow={!TOPICS_CLOSED_BY_DEFAULT.includes(topic)}
    >
      {(TOPICS as any)[topic].map((t: string) => {
        if (veils.includes(t) || lines.includes(t)) return null;
        return (
          <Topic
            key={t}
            topicName={t}
            onLine={handleLine?.(t)}
            onVeil={handleVeil?.(t)}
          />
        );
      })}
    </Collapsible>
  );
}

//*
export default function ResponseStep({
  groupData,
  codename,
  onSave,
}: {
  groupData: GroupData;
  codename: string;
  onSave: (rating: Ratings | null, lines: string[], veils: string[]) => void;
}) {
  const [rating, setRating] = useState<Ratings | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [veils, setVeils] = useState<string[]>([]);
  const [customLine, setCustomLine] = useState<string>("");
  const [customVeil, setCustomVeil] = useState<string>("");

  useEffect(() => {
    const response = groupData?.responses?.[codename];
    if (!response) return;

    setRating(response.rating ?? null);
    setLines(Object.values(response.lines || []));
    setVeils(Object.values(response.veils || []));
  }, []);

  const handleToggleRating = (r: Ratings) => () => {
    if (rating === r) setRating(null);
    else setRating(r);
  };

  const handleOkay = (topic: string) => () => {
    setVeils((veils) => veils.filter((t) => t !== topic));
    setLines((lines) => lines.filter((t) => t !== topic));
  };

  const handleVeil = (topic: string) => () => {
    setLines((lines) => lines.filter((t) => t !== topic));
    setVeils((veils) => [...veils, topic]);
  };

  const handleLine = (topic: string) => () => {
    setVeils((veils) => veils.filter((t) => t !== topic));
    setLines((lines) => [...lines, topic]);
  };

  function handleCustomVeil() {
    if (!!customVeil) {
      veils.push(customVeil);
      setCustomVeil("");
    }
  }

  function handleCustomLine() {
    if (!!customLine) {
      lines.push(customLine);
      setCustomLine("");
    }
  }

  if (!codename) return null;

  return (
    <Flex col align="center" gap={sp("xxl")} className={styles.container}>
      {/* //* Ratings */}
      <Flex col align="center" gap={sp("sm")}>
        <Text h3 margin={0}>
          Rating
        </Text>
        <Text h5 margin={0} intent="secondary">
          If this game was a movie, it would be ideally rated
        </Text>
        <Menu horizontal>
          {RatingOptions.map((r) => (
            <Menu.Item
              key={r}
              selected={r === rating}
              onClick={handleToggleRating(r)}
            >
              <Text>{r}</Text>
            </Menu.Item>
          ))}
        </Menu>
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
              {veils.map((v) => (
                <Topic
                  key={v}
                  topicName={v}
                  onLine={handleLine(v)}
                  onOkay={handleOkay(v)}
                />
              ))}
              {veils.length === 0 && <Text fontStyle="italic">-</Text>}
              <Flex gap={sp("sm")}>
                <input
                  placeholder="Custom veil"
                  value={customVeil}
                  onChange={(e) => setCustomVeil(e.target.value)}
                />
                <Button color="yellow" onClick={handleCustomVeil}>
                  Add
                </Button>
              </Flex>
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
              {lines.map((l) => (
                <Topic
                  key={l}
                  topicName={l}
                  onVeil={handleVeil(l)}
                  onOkay={handleOkay(l)}
                />
              ))}
              {lines.length === 0 && <Text fontStyle="italic">-</Text>}
              <Flex gap={sp("sm")}>
                <input
                  placeholder="Custom line"
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                />
                <Button color="red" onClick={handleCustomLine}>
                  Add
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Grid>

        <Divider lg />

        {/* //* Topics to Consider */}
        <Text h5 intent="secondary">
          Some Topics to Consider
        </Text>
        <Grid colNum={2} gap={sp("sm")}>
          {[TopicKeys.slice(0, 4), TopicKeys.slice(4)].map((tk, i) => (
            <Flex key={i} col gap={sp("md")}>
              {tk.map((topic) => {
                return (
                  <MajorTopic
                    key={topic}
                    topic={topic}
                    handleLine={handleLine}
                    handleVeil={handleVeil}
                    veils={veils}
                    lines={lines}
                  />
                );
              })}
            </Flex>
          ))}
        </Grid>
      </Flex>

      <Button onClick={() => onSave(rating, lines, veils)}>Save</Button>
    </Flex>
  );
}
