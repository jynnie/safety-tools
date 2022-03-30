import { Button, Divider, Flex, Grid, Text } from "juniper-ui/dist";
import { useState } from "react";
import { GroupData, Ratings } from "data.model";
import { useEffect } from "react";
import styles from "styles/Results.module.scss";
import { sp } from "styles/utils";
import { TOPICS } from "lib/topics";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  XOctagon,
} from "react-feather";
import cn from "classnames";

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
          className={styles.round}
          appearance="minimal"
          onClick={onVeil}
          color="yellow"
        >
          <AlertTriangle />
        </Button>
      )}
      {onLine && (
        <Button
          className={styles.round}
          appearance="minimal"
          onClick={onLine}
          color="red"
        >
          <XOctagon />
        </Button>
      )}
      {onOkay && (
        <Button
          className={styles.round}
          appearance="minimal"
          onClick={onOkay}
          color="blue"
        >
          <CheckCircle />
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
          className={styles.round}
          appearance="minimal"
          onClick={() => setShow(!show)}
        >
          {show ? <ChevronDown /> : <ChevronRight />}
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
      defaultShow={false}
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
    <Flex col align="flex-start" gap={sp("xxl")}>
      {/* //* Ratings */}
      <Flex col>
        <Text h4 margin={0}>
          Rating
        </Text>
        <Text p>If this game was a movie, it would be ideally rated</Text>
        <Grid colNum={5} gap={sp("sm")}>
          {RatingOptions.map((r) => (
            <Flex
              key={r}
              className={cn("ratingOption", { isVoted: r === rating })}
              onClick={handleToggleRating(r)}
            >
              <Text bold>{r}</Text>
            </Flex>
          ))}
        </Grid>
      </Flex>

      <Flex col width="100%">
        <Text h4>Topic Boundaries</Text>
        <Grid gap={sp("sm")} className={styles.topicsContainer}>
          {/* //* Lines */}
          <Flex col className={styles.veils}>
            <Flex align="center" gap={sp("xs")}>
              <AlertTriangle />
              <Text h4 margin={0}>
                Veils
              </Text>
            </Flex>
            <Text caption fontSize="var(--font-size-sm)">
              Topics that are soft limits, okay if veiled or offstage
            </Text>

            <Flex col marginTop={sp("sm")} gap={sp("sm")} wrap>
              {veils.map((v) => (
                <Topic
                  key={v}
                  topicName={v}
                  onLine={handleLine(v)}
                  onOkay={handleOkay(v)}
                />
              ))}

              {veils.length === 0 && <Text fontStyle="italic">-</Text>}

              <Flex gap={sp("sm")} align="center">
                <input
                  className="light"
                  placeholder="Custom veil"
                  value={customVeil}
                  onChange={(e) => setCustomVeil(e.target.value)}
                />
                <Button
                  color="yellow"
                  className={styles.round}
                  onClick={handleCustomVeil}
                >
                  <Plus />
                </Button>
              </Flex>
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
            <Text caption fontSize="var(--font-size-sm)">
              Topics that are hard limits, not okay at all, including in
              reference
            </Text>

            <Flex col marginTop={sp("sm")} gap={sp("sm")} wrap>
              {lines.map((l) => (
                <Topic
                  key={l}
                  topicName={l}
                  onVeil={handleVeil(l)}
                  onOkay={handleOkay(l)}
                />
              ))}
              {lines.length === 0 && <Text fontStyle="italic">-</Text>}

              <Flex gap={sp("sm")} align="center">
                <input
                  className="light"
                  placeholder="Custom line"
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                />
                <Button
                  color="red"
                  className={styles.round}
                  onClick={handleCustomLine}
                >
                  <Plus />
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Grid>

        <Divider lg />

        {/* //* Topics to Consider */}
        <Text h6>Some Topics to Consider</Text>
        <Grid gap={sp("sm")} className={styles.topicsContainer}>
          {[TopicKeys.slice(0, 3), TopicKeys.slice(3)].map((tk, i) => (
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

      <Button
        className={styles.fullWidthButton}
        onClick={() => onSave(rating, lines, veils)}
      >
        Save
      </Button>
    </Flex>
  );
}
