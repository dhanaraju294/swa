import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AccessibilityInfo,
  Animated,
  AppState,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusClient, FocusCoreError } from "./core-client";
import {
  GAME_NAMES,
  GAME_SKILLS,
  GAME_SUMMARIES,
  INKS,
  LEVELS,
  durationLabel,
  getLevel,
} from "./catalogue";
import { bestForLevel } from "./storage/repository";
import { focusTheme, type FocusTheme } from "./theme";
import { FeedbackFX } from "./components/FeedbackFX";
import type {
  FeedbackAdapter,
  FocusRepository,
  FocusResult,
  Game,
  Level,
  SavedResult,
  Snapshot,
} from "./types";
export interface FocusZoneProps {
  client: FocusClient;
  repository: FocusRepository;
  onExit?: () => void;
  feedback?: FeedbackAdapter;
  theme?: FocusTheme;
  allowAdvancedGrid?: boolean;
  /** Host route visibility. Wire to useIsFocused or your router equivalent. */
  isFocused?: boolean;
}
type Screen =
  | "home"
  | "levels"
  | "instructions"
  | "play"
  | "result"
  | "practiceResult"
  | "progress";
const FocusUIContext = React.createContext<{
  styles: ReturnType<typeof makeStyles>;
  screen: Screen;
  back: () => void;
  canExit: boolean;
} | null>(null);
const Button = ({
  label,
  onPress,
  secondary = false,
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  testID?: string;
}) => {
  const { styles } = useContext(FocusUIContext)!;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>
        {label}
      </Text>
    </Pressable>
  );
};
const Header = ({ label = "FOCUS ZONE" }: { label?: string }) => {
  const { styles, screen, back, canExit } = useContext(FocusUIContext)!;
  return (
    <View style={styles.top}>
      <Pressable
        disabled={screen === "home" && !canExit}
        onPress={back}
        accessibilityRole="button"
        accessibilityLabel={screen === "home" ? "Leave Focus Zone" : "Back"}
        style={styles.back}
      >
        <Text style={styles.backText}>{screen === "home" ? "✳" : "←"}</Text>
      </Pressable>
      <Text style={styles.topLabel}>{label}</Text>
      <View style={styles.localDot}>
        <View style={styles.dot} />
        <Text style={styles.localText}>ON DEVICE</Text>
      </View>
    </View>
  );
};
export function FocusZone(props: FocusZoneProps) {
  return <FocusZoneContent key={props.repository.scope} {...props} />;
}
function FocusZoneContent({
  client,
  repository,
  onExit,
  feedback,
  theme = focusTheme,
  allowAdvancedGrid = true,
  isFocused = true,
}: FocusZoneProps) {
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const snapshot = useSyncExternalStore(
    client.subscribe,
    client.getSnapshot,
    client.getSnapshot,
  );
  const [screen, setScreen] = useState<Screen>("home"),
    [game, setGame] = useState<Game>("stroop"),
    [level, setLevel] = useState<Level>(getLevel(1));
  const [rows, setRows] = useState<SavedResult[]>([]),
    [historyReady, setHistoryReady] = useState(false),
    [historyError, setHistoryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null),
    [saveStatus, setSaveStatus] = useState<
      "idle" | "saving" | "saved" | "failed"
    >("idle"),
    [busy, setBusy] = useState(false),
    [motion, setMotion] = useState(false),
    [clearConfirm, setClearConfirm] = useState(false);
  const owned = useRef<string | null>(null),
    saved = useRef(new Set<string>()),
    completed = useRef<FocusResult | null>(null),
    mounted = useRef(true),
    lastFeedback = useRef("");
  const actionEpoch = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [screen, level.id, snapshot?.phase === "paused"]);
  const pop = useRef(new Animated.Value(1)).current,
    shake = useRef(new Animated.Value(0)).current,
    timer = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      actionEpoch.current++;
      const s = client.getSnapshot();
      if (
        s &&
        s.sessionId === owned.current &&
        ["active", "paused"].includes(s.phase)
      )
        void client
          .dispatch({ cmd: "abandon", sessionId: s.sessionId })
          .catch(() => {});
    };
  }, [client]);
  useEffect(() => {
    let alive = true;
    void repository
      .load()
      .then((h) => {
        if (alive) {
          setRows(h);
          setHistoryReady(true);
        }
      })
      .catch((e) => {
        if (alive) {
          setHistoryError(String(e.message || e));
          setHistoryReady(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [repository]);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted.current) setMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setMotion,
    );
    return () => sub.remove();
  }, []);
  const dispatch = useCallback(
    async (command: Parameters<FocusClient["dispatch"]>[0]) => {
      try {
        const r = await client.dispatch(command);
        if (mounted.current) setError(null);
        return r;
      } catch (e) {
        if (
          e instanceof FocusCoreError &&
          [
            "stale_session",
            "stale_trial",
            "duplicate_input",
            "not_active",
          ].includes(e.code)
        )
          return undefined;
        if (mounted.current)
          setError(
            e instanceof Error
              ? e.message
              : "The on-device core is unavailable.",
          );
        return undefined;
      }
    },
    [client],
  );
  const save = useCallback(
    async (result: FocusResult) => {
      setSaveStatus("saving");
      try {
        await repository.save(result);
        const history = await repository.load();
        if (mounted.current) {
          setRows(history);
          setSaveStatus("saved");
          setHistoryError(null);
        }
      } catch {
        if (mounted.current) setSaveStatus("failed");
      }
    },
    [repository],
  );
  useEffect(() => {
    if (
      snapshot?.sessionId !== owned.current ||
      snapshot?.phase !== "completed" ||
      !snapshot.result
    )
      return;
    completed.current = snapshot.result;
    if (snapshot.isPractice) {
      setScreen("practiceResult");
      return;
    }
    setScreen("result");
    if (!saved.current.has(snapshot.sessionId)) {
      saved.current.add(snapshot.sessionId);
      void save(snapshot.result);
    }
  }, [snapshot, save]);
  useEffect(() => {
    if (
      !isFocused ||
      screen !== "play" ||
      snapshot?.phase !== "active" ||
      snapshot.sessionId !== owned.current
    )
      return;
    let stopped = false;
    let handle: ReturnType<typeof setTimeout>;
    const poll = async () => {
      if (stopped) return;
      await dispatch({ cmd: "poll", sessionId: owned.current! });
      if (!stopped) handle = setTimeout(poll, 80);
    };
    handle = setTimeout(poll, 80);
    return () => {
      stopped = true;
      clearTimeout(handle);
    };
  }, [screen, snapshot?.phase, snapshot?.sessionId, dispatch, isFocused]);
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      const s = client.getSnapshot();
      if (
        state !== "active" &&
        s?.sessionId === owned.current &&
        s.phase === "active"
      )
        void dispatch({ cmd: "pause", sessionId: s.sessionId });
    });
    return () => listener.remove();
  }, [client, dispatch]);
  useEffect(() => {
    if (isFocused) return;
    actionEpoch.current++;
    const s = client.getSnapshot();
    if (s && s.sessionId === owned.current && s.phase === "active")
      void dispatch({ cmd: "pause", sessionId: s.sessionId });
  }, [isFocused, client, dispatch]);
  const back = useCallback(() => {
    if (screen === "play") {
      const s = client.getSnapshot();
      if (s?.phase === "active")
        void dispatch({ cmd: "pause", sessionId: s.sessionId });
      else if (s?.phase === "paused") {
        actionEpoch.current++;
        owned.current = null;
        void dispatch({ cmd: "abandon", sessionId: s.sessionId });
        setScreen("levels");
      }
      return;
    }
    actionEpoch.current++;
    owned.current = null;
    if (screen === "home") {
      onExit?.();
      return;
    }
    if (
      screen === "instructions" ||
      screen === "result" ||
      screen === "practiceResult"
    )
      setScreen("levels");
    else setScreen("home");
  }, [screen, client, dispatch, onExit]);
  useEffect(() => {
    if (Platform.OS === "web" || !isFocused) return;
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "home" && !onExit) return false;
      back();
      return true;
    });
    return () => listener.remove();
  }, [screen, back, onExit, isFocused]);
  useEffect(() => {
    if (screen !== "play" || !snapshot || snapshot.sessionId !== owned.current)
      return;
    pop.stopAnimation();
    shake.stopAnimation();
    if (motion) {
      pop.setValue(1);
      shake.setValue(0);
      return;
    }
    pop.setValue(0.96);
    const a = Animated.spring(pop, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: Platform.OS !== "web",
    });
    a.start();
    return () => a.stop();
  }, [snapshot?.trialId, screen, motion, pop, shake]);
  useEffect(() => {
    const f = snapshot?.feedback;
    if (!isFocused || !f || snapshot?.sessionId !== owned.current) return;
    const key = `${snapshot.sessionId}:${f.id}`;
    if (lastFeedback.current === key) return;
    lastFeedback.current = key;
    try {
      const result = f.positive ? feedback?.success() : feedback?.notice();
      void Promise.resolve(result).catch(() => {});
    } catch {
      /* Optional host feedback must never interrupt a round. */
    }
    if (!f.positive && !motion) {
      const a = Animated.sequence(
        [-3, 3, 0].map((v) =>
          Animated.timing(shake, {
            toValue: v,
            duration: 60,
            useNativeDriver: Platform.OS !== "web",
          }),
        ),
      );
      a.start();
      return () => a.stop();
    }
  }, [
    snapshot?.feedback?.id,
    snapshot?.sessionId,
    feedback,
    motion,
    shake,
    isFocused,
  ]);
  useEffect(() => {
    if (!snapshot || screen !== "play" || !level.durationMs) return;
    timer.stopAnimation();
    timer.setValue(
      (snapshot.remainingMs ?? level.durationMs) / level.durationMs,
    );
    if (snapshot.phase === "active" && !motion) {
      const a = Animated.timing(timer, {
        toValue: 0,
        duration: snapshot.remainingMs ?? level.durationMs,
        useNativeDriver: Platform.OS !== "web",
      });
      a.start();
      return () => a.stop();
    }
  }, [
    snapshot?.sessionId,
    snapshot?.phase,
    screen,
    level.durationMs,
    motion,
    timer,
  ]);
  const start = async (practice = false) => {
    if (busy || !isFocused) return;
    const requestEpoch = ++actionEpoch.current;
    setBusy(true);
    setSaveStatus("idle");
    completed.current = null;
    const r = await dispatch({ cmd: "start", levelId: level.id, practice });
    if (
      r?.snapshot &&
      (!mounted.current || requestEpoch !== actionEpoch.current)
    ) {
      await client
        .dispatch({ cmd: "abandon", sessionId: r.snapshot.sessionId })
        .catch(() => {});
    } else if (r?.snapshot && mounted.current) {
      owned.current = r.snapshot.sessionId;
      lastFeedback.current = "";
      setScreen("play");
    }
    if (mounted.current) setBusy(false);
  };
  const answer = async (choice: number) => {
    const s = client.getSnapshot();
    if (
      busy ||
      !isFocused ||
      !s ||
      s.phase !== "active" ||
      s.sessionId !== owned.current
    )
      return;
    setBusy(true);
    await dispatch({
      cmd: "answer",
      sessionId: s.sessionId,
      trialId: s.trialId,
      choice,
    });
    if (mounted.current) setBusy(false);
  };
  const abandon = async () => {
    actionEpoch.current++;
    const s = client.getSnapshot();
    if (s?.sessionId === owned.current)
      await dispatch({ cmd: "abandon", sessionId: s.sessionId });
    owned.current = null;
    setScreen("levels");
  };
  const chooseGame = (g: Game) => {
    actionEpoch.current++;
    owned.current = null;
    setGame(g);
    setLevel(LEVELS.find((l) => l.game === g)!);
    setScreen("levels");
  };
  const select = (l: Level) => {
    actionEpoch.current++;
    owned.current = null;
    setLevel(l);
    setGame(l.game);
    setError(null);
    setScreen("instructions");
  };
  const [showNotes, setShowNotes] = useState(false);
  const result = completed.current;
  let body: React.ReactNode;
  if (screen === "home")
    body = (
      <>
        <Header />
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>A SMALL PAUSE, JUST FOR YOU</Text>
          <Text accessibilityRole="header" style={styles.heroTitle}>
            A little play.{`\n`}A <Text style={styles.italic}>clearer</Text>{" "}
            mind.
          </Text>
          <Text style={styles.body}>
            Small challenges. One moment of focus.{`\n`}Come back to yourself,
            at your own pace.
          </Text>
          <View style={styles.heroPills}>
            <Text style={styles.pill}>◷ Short rounds</Text>
            <Text style={styles.pill}>♧ No pressure</Text>
          </View>
        </View>
        <View style={styles.sectionTitle}>
          <Text accessibilityRole="header" style={styles.h2}>
            Choose your moment
          </Text>
          <Text style={styles.mini}>
            {allowAdvancedGrid ? "30" : "27"} levels
          </Text>
        </View>
        {(["stroop", "schulte", "go"] as Game[]).map((g, i) => (
          <Pressable
            testID={`game-${g}`}
            accessibilityRole="button"
            accessibilityLabel={`Choose ${GAME_NAMES[g]}, ${g === "schulte" && !allowAdvancedGrid ? 7 : 10} levels`}
            key={g}
            onPress={() => chooseGame(g)}
            style={({ pressed }) => [
              styles.gameCard,
              pressed && styles.pressed,
            ]}
          >
            <GameArt game={g} theme={theme} />
            <View style={styles.gameCopy}>
              <Text style={styles.gameNumber}>
                0{i + 1} / {GAME_SKILLS[g].toUpperCase()}
              </Text>
              <Text style={styles.cardTitle}>{GAME_NAMES[g]}</Text>
              <Text style={styles.cardDescription}>{GAME_SUMMARIES[g]}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.mini}>
                  {g === "schulte" && !allowAdvancedGrid ? 7 : 10} short
                  challenges
                </Text>
                <Text style={styles.cardArrow}>↗</Text>
              </View>
            </View>
          </Pressable>
        ))}
        <Pressable
          testID="progress"
          onPress={() => setScreen("progress")}
          accessibilityRole="button"
          style={styles.journey}
        >
          <View style={styles.journeySymbol}>
            <Text style={styles.cardArrow}>↗</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>YOUR OWN LITTLE JOURNEY</Text>
            <Text style={styles.journeyTitle}>Progress, not perfection.</Text>
            <Text style={styles.mini}>
              {rows.length
                ? `${rows.length} moments completed. Each one counts.`
                : "Your first moment is one round away."}
            </Text>
          </View>
          <Text style={styles.cardArrow}>→</Text>
        </Pressable>
        <Text style={styles.footnote}>
          No streaks. No competition. Just your own practice.
        </Text>
        <Pressable
          onPress={() => setShowNotes(!showNotes)}
          accessibilityRole="button"
          style={styles.notesButton}
        >
          <Text style={styles.notesText}>ⓘ About your scores & privacy</Text>
        </Pressable>
        {showNotes && (
          <View style={styles.noteCard}>
            <Text style={styles.body}>
              Scores describe only these tasks, not your attention in daily life
              or your mental health. Your history stays in your app’s chosen
              on-device store. Shared devices may expose it unless the host app
              protects it.
            </Text>
            <Text style={styles.body}>
              Stroop requires colour perception. Schulte and Go / No-Go provide
              colour-independent alternatives. Sound and haptics are off unless
              your app explicitly supplies feedback.
            </Text>
          </View>
        )}
      </>
    );
  else if (screen === "levels")
    body = (
      <>
        <Header label="YOUR MOMENT OF FOCUS" />
        <View style={styles.levelIntro}>
          <Text style={styles.eyebrow}>{GAME_SKILLS[game].toUpperCase()}</Text>
          <Text accessibilityRole="header" style={styles.pageTitle}>
            {GAME_NAMES[game]}
          </Text>
          <Text style={styles.body}>{GAME_SUMMARIES[game]}</Text>
          <View style={styles.levelBanner}>
            <GameArt game={game} theme={theme} large />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                A level for every{`\n`}kind of moment.
              </Text>
              <Text style={styles.mini}>
                All levels are yours to explore.{`\n`}No unlocking. No perfect
                score needed.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionTitle}>
          <Text style={styles.h2}>Find your pace</Text>
          <Text style={styles.mini}>
            {
              new Set(rows.filter((r) => r.game === game).map((r) => r.levelId))
                .size
            }{" "}
            completed
          </Text>
        </View>
        <View style={styles.levelGrid}>
          {LEVELS.filter(
            (l) => l.game === game && (allowAdvancedGrid || l.gridSize !== 5),
          ).map((l) => {
            const done = rows.some((r) => r.levelId === l.id);
            return (
              <Pressable
                key={l.id}
                testID={`level-${l.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Level ${l.number}, ${l.title}, ${durationLabel(l)}${done ? ", completed" : ""}`}
                onPress={() => select(l)}
                style={({ pressed }) => [
                  styles.levelTile,
                  done && styles.completedTile,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.tileTop}>
                  <Text style={styles.levelNumber}>
                    {String(l.number).padStart(2, "0")}
                  </Text>
                  <Text style={styles.tileMark}>{done ? "✓" : "↗"}</Text>
                </View>
                <Text style={styles.levelTitle}>{l.title}</Text>
                <Text style={styles.levelDuration}>{durationLabel(l)}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.footnote}>
          Choose a challenge. You can always pause.
        </Text>
      </>
    );
  else if (screen === "instructions")
    body = (
      <>
        <Header label={`LEVEL ${level.number} / 10`} />
        <View style={styles.levelIntro}>
          <Text style={styles.eyebrow}>
            {GAME_NAMES[level.game].toUpperCase()}
          </Text>
          <Text accessibilityRole="header" style={styles.pageTitle}>
            {level.title}
          </Text>
          <Text style={styles.pill}>{durationLabel(level)}</Text>
        </View>
        <View style={styles.demo}>
          <GameArt game={level.game} theme={theme} large />
          <View style={{ flex: 1 }}>
            <Text style={styles.demoTitle}>
              {level.game === "stroop"
                ? "The ink is blue."
                : level.game === "go"
                  ? "X → Tap"
                  : "Follow the next number."}
            </Text>
            <Text style={styles.body}>
              {level.game === "stroop"
                ? "Even when the word says RED."
                : level.game === "go"
                  ? "Other letters → Wait"
                  : level.rule}
            </Text>
          </View>
        </View>
        <Text style={styles.h2}>Your one simple rule</Text>
        <Text style={styles.rule}>{level.description}</Text>
        <View style={styles.ruleCard}>
          <Text style={styles.eyebrow}>THIS LEVEL</Text>
          <Text style={styles.body}>{level.rule}</Text>
          <Text style={styles.mini}>
            {level.game === "schulte"
              ? "The grid stays fixed. The next target is always shown."
              : "The pace stays fixed during the round. Accuracy matters more than speed."}
          </Text>
        </View>
        {level.game === "stroop" && (
          <Text style={styles.footnote}>
            Use the named buttons. This task still requires distinguishing ink
            colours.
          </Text>
        )}
        <View style={styles.startArea}>
          <Button
            testID="start"
            label={
              level.game === "go" && !rows.some((r) => r.game === "go")
                ? "Try a 3-letter warm-up →"
                : "Let’s play →"
            }
            disabled={busy || !historyReady}
            onPress={() =>
              void start(
                level.game === "go" && !rows.some((r) => r.game === "go"),
              )
            }
          />
          <Text style={styles.footnote}>
            A small challenge. Not a test of your potential.
          </Text>
        </View>
      </>
    );
  else if (
    screen === "play" &&
    snapshot &&
    snapshot.sessionId === owned.current
  ) {
    const s = snapshot;
    const paused = s.phase === "paused";
    const score = s.metrics.score;
    const correct = level.game === "go" ? s.counters.hits : s.counters.correct;
    body = (
      <>
        <View style={styles.playTop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pause round"
            testID="pause"
            onPress={() =>
              void dispatch({ cmd: "pause", sessionId: s.sessionId })
            }
            style={styles.roundControl}
          >
            <Text style={styles.backText}>Ⅱ</Text>
          </Pressable>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.eyebrow}>
              {GAME_NAMES[level.game].toUpperCase()}
            </Text>
            <Text style={styles.playSubtitle}>
              {s.isPractice
                ? "A quick warm-up"
                : `Level ${level.number} · ${level.title}`}
            </Text>
          </View>
          <Text style={styles.tinyLeaf}>✳</Text>
        </View>
        {paused ? (
          <View style={styles.pausePanel}>
            <Text style={styles.pauseIcon}>Ⅱ</Text>
            <Text style={styles.pageTitle}>A moment to pause.</Text>
            <Text style={styles.body}>
              Your round is right here.{`\n`}The timer is paused, too.
            </Text>
            <Button
              testID="resume"
              label="Continue playing →"
              onPress={() =>
                void dispatch({ cmd: "resume", sessionId: s.sessionId })
              }
            />
            <Button
              label="Start a fresh round"
              secondary
              onPress={() => void start(s.isPractice)}
            />
            <Button
              label="Back to levels"
              secondary
              onPress={() => void abandon()}
            />
          </View>
        ) : (
          <>
            <View style={styles.hud}>
              <Hud
                label={s.isPractice ? "PRACTICE" : "SCORE"}
                value={
                  s.isPractice
                    ? `${s.counters.presented} / 3`
                    : score.toLocaleString()
                }
                styles={styles}
              />
              <Hud
                label={level.game === "go" ? "TARGETS" : "CORRECT"}
                value={String(correct)}
                styles={styles}
              />
              <Hud
                label={
                  level.game === "schulte"
                    ? "ELAPSED"
                    : s.isPractice
                      ? "UNTIMED"
                      : "REMAINING"
                }
                value={
                  s.isPractice
                    ? "Practice"
                    : level.game === "schulte"
                      ? `${(s.elapsedMs / 1000).toFixed(1)}s`
                      : `${Math.ceil((s.remainingMs ?? 0) / 1000)}s`
                }
                styles={styles}
              />
            </View>
            {level.durationMs > 0 && !s.isPractice && (
              <View style={styles.timerTrack}>
                <Animated.View
                  style={[
                    styles.timerFill,
                    {
                      transform: [
                        {
                          scaleX: motion
                            ? (s.remainingMs ?? 0) / level.durationMs
                            : timer,
                        },
                      ],
                    },
                  ]}
                />
              </View>
            )}
            <Animated.View
              style={{ transform: [{ scale: pop }, { translateX: shake }] }}
            >
              {level.game === "schulte" ? (
                <>
                  <View style={styles.nextPrompt}>
                    <Text style={styles.body}>Find next</Text>
                    <Text style={styles.nextNumber} testID="next-number">
                      {s.nextNumber}
                    </Text>
                  </View>
                  <Text style={styles.sequenceNote}>{level.rule}</Text>
                  <View style={styles.numberGrid}>
                    {s.grid?.map((n) => {
                      const found = s.found.includes(n);
                      return (
                        <View
                          key={n}
                          style={{
                            width: `${100 / (level.gridSize ?? 4)}%`,
                            padding: 3,
                          }}
                        >
                          <Pressable
                            testID={`number-${n}`}
                            accessibilityRole="button"
                            accessibilityLabel={`Number ${n}${found ? ", already found" : ""}`}
                            disabled={found || busy}
                            onPress={() => void answer(n)}
                            style={({ pressed }) => [
                              styles.cell,
                              found && styles.foundCell,
                              pressed && styles.pressed,
                            ]}
                          >
                            <Text
                              style={[
                                styles.cellText,
                                { fontSize: level.gridSize === 5 ? 23 : 29 },
                                found && styles.foundText,
                              ]}
                            >
                              {found ? "✓" : n}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                </>
              ) : (
                <View style={styles.stimulusCard}>
                  {level.game === "stroop" ? (
                    <>
                      <Text style={styles.stimulusPrompt}>
                        NAME THE INK COLOUR
                      </Text>
                      <Text
                        testID="stimulus"
                        accessibilityLabel="Colour word stimulus"
                        style={[
                          styles.stroopWord,
                          { color: INKS[s.stimulus?.ink ?? 0]?.hex },
                        ]}
                      >
                        {INKS[s.stimulus?.word ?? 0]?.name.toUpperCase()}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.stimulusPrompt}>
                        X → TAP · OTHER LETTERS → WAIT
                      </Text>
                      <View
                        style={[
                          styles.letterCircle,
                          s.stimulus?.letter !== "X" && styles.otherLetter,
                        ]}
                      >
                        <Text
                          testID="stimulus"
                          style={[
                            styles.goLetter,
                            { opacity: s.stimulus?.visible ? 1 : 0 },
                          ]}
                        >
                          {s.stimulus?.letter}
                        </Text>
                      </View>
                    </>
                  )}
                  <FeedbackFX
                    eventId={s.feedback?.id ?? 0}
                    positive={s.feedback?.positive ?? false}
                    reducedMotion={motion}
                  />
                </View>
              )}
            </Animated.View>
            <View style={styles.feedbackLine} accessibilityLiveRegion="polite">
              <Text
                style={[
                  styles.feedbackText,
                  s.feedback && !s.feedback.positive && styles.noticeText,
                ]}
              >
                {s.feedback
                  ? `${s.feedback.positive ? "✓" : "↺"} ${s.feedback.message}`
                  : level.game === "stroop"
                    ? "Ink, not the word."
                    : level.game === "schulte"
                      ? "One small step at a time."
                      : "Notice before you respond."}
              </Text>
            </View>
            {level.game === "stroop" ? (
              <View style={styles.answers}>
                {INKS.map((c, i) => (
                  <Pressable
                    key={c.name}
                    testID={`answer-${i}`}
                    accessibilityRole="button"
                    accessibilityLabel={c.name}
                    disabled={
                      busy || s.stimulus?.responded || !s.stimulus?.visible
                    }
                    onPress={() => void answer(i)}
                    style={({ pressed }) => [
                      styles.answer,
                      pressed && styles.pressed,
                      (busy || s.stimulus?.responded) && styles.disabled,
                    ]}
                  >
                    <View style={[styles.inkDot, { backgroundColor: c.hex }]} />
                    <Text style={styles.answerText}>{c.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : level.game === "go" ? (
              <Button
                testID="respond"
                label="Respond to X"
                disabled={busy || s.stimulus?.responded || !s.stimulus?.visible}
                onPress={() => void answer(1)}
              />
            ) : null}
            <Text style={styles.footnote}>
              {s.isPractice
                ? "No scores saved. Just getting the feel of it."
                : "Accuracy over speed. This is your moment."}
            </Text>
          </>
        )}
      </>
    );
  } else if (screen === "practiceResult" && result)
    body = (
      <>
        <Header label="WARM-UP COMPLETE" />
        <View style={styles.resultHero}>
          <Text style={styles.resultSymbol}>✓</Text>
          <Text accessibilityRole="header" style={styles.pageTitle}>
            You’ve got the idea.
          </Text>
          <Text style={styles.body}>
            {result.counters.hits + result.counters.withheld} of 3 practice
            letters handled correctly.{`\n`}Tap for X. Let every other letter
            pass.
          </Text>
        </View>
        <View style={styles.startArea}>
          <Button
            testID="timed-start"
            label={`Start my ${level.durationMs / 1000}-second round →`}
            disabled={busy}
            onPress={() => void start(false)}
          />
          <Button
            label="Practise again"
            secondary
            onPress={() => void start(true)}
          />
          <Text style={styles.footnote}>
            Warm-up rounds never enter your history.
          </Text>
        </View>
      </>
    );
  else if (screen === "result" && result) {
    const r = result,
      m = r.metrics;
    const best = bestForLevel(rows, level.id)[0];
    const bestNow = best?.sessionId === r.sessionId;
    const metrics =
      level.game === "stroop"
        ? [
            [`${r.counters.correct}`, "Correct"],
            [`${m.accuracy}%`, "Answer accuracy"],
            [formatRT(m.averageResponseMs), "Avg. response"],
          ]
        : level.game === "schulte"
          ? [
              [`${level.gridSize} × ${level.gridSize}`, "Grid found"],
              [`${(r.durationMs / 1000).toFixed(1)}s`, "Completion"],
              [`${m.accuracy}%`, "Tap accuracy"],
            ]
          : [
              [`${r.counters.hits}/${r.counters.targets}`, "Targets found"],
              [`${m.hitRate}%`, "Hit rate"],
              [`${m.falseAlarmRate}%`, "False alarms"],
            ];
    body = (
      <>
        <Header label="YOUR MOMENT, COMPLETE" />
        <View style={styles.resultHero}>
          <Text style={styles.resultSymbol}>✦</Text>
          <FeedbackFX eventId={1} positive={true} reducedMotion={motion} />
          <Text accessibilityRole="header" style={styles.pageTitle}>
            A little more present.
          </Text>
          <Text style={styles.body}>
            Nice work. You made space{`\n`}for a moment of focus.
          </Text>
          <Text style={[styles.eyebrow, { marginTop: 26 }]}>
            YOUR ROUND SCORE
          </Text>
          <Text testID="result-score" style={styles.resultScore}>
            {m.score.toLocaleString()}
          </Text>
          {bestNow && (
            <Text style={styles.bestPill}>
              ✧ Your personal best for this level
            </Text>
          )}
        </View>
        <View style={styles.resultMetrics}>
          {metrics.map(([value, label]) => (
            <View style={styles.metricCard} key={label}>
              <Text style={styles.metricValue}>{value}</Text>
              <Text style={styles.metricLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.ruleCard}>
          <Text style={styles.body}>
            {level.game === "stroop"
              ? `${r.counters.incorrect} incorrect · ${r.counters.missed} missed · ${r.counters.presented} trials`
              : level.game === "schulte"
                ? `${r.counters.incorrect} incorrect selections · All ${r.counters.correct} numbers found`
                : `${r.counters.missed} missed targets · ${r.counters.falseAlarms} incorrect taps · ${r.counters.withheld} correct pauses`}
          </Text>
          <Text style={styles.mini}>
            {level.game === "stroop"
              ? "Answer accuracy excludes missed trials."
              : level.game === "schulte"
                ? "Times are compared within this same level only."
                : `${r.counters.targets} targets · ${r.counters.nonTargets} other letters · ${formatRT(m.averageResponseMs)} avg. hit response`}
          </Text>
        </View>
        <View style={styles.startArea}>
          <Button
            testID="restart"
            label="Play again ↗"
            disabled={busy}
            onPress={() => void start(false)}
          />
          {LEVELS.some(
            (l) =>
              l.game === level.game &&
              l.number === level.number + 1 &&
              (allowAdvancedGrid || l.gridSize !== 5),
          ) && (
            <Button
              label="Try the next level"
              secondary
              onPress={() =>
                select(
                  LEVELS.find(
                    (l) =>
                      l.game === level.game && l.number === level.number + 1,
                  )!,
                )
              }
            />
          )}
          <Button
            label="Back to my day"
            secondary
            onPress={() => {
              actionEpoch.current++;
              owned.current = null;
              if (onExit) onExit();
              else setScreen("home");
            }}
          />
        </View>
        {saveStatus === "failed" ? (
          <View accessibilityRole="alert" style={styles.saveWarning}>
            <Text style={styles.body}>
              Your round is complete, but couldn’t be saved. It remains here
              until you leave.
            </Text>
            <Button
              label="Retry saving"
              secondary
              onPress={() => void save(r)}
            />
          </View>
        ) : (
          <Text style={styles.footnote}>
            {saveStatus === "saved"
              ? "✓ Saved on this device"
              : "Saving your moment…"}
          </Text>
        )}
      </>
    );
  } else if (screen === "progress")
    body = (
      <>
        <Header label="YOUR OWN LITTLE JOURNEY" />
        <View style={styles.intro}>
          <Text accessibilityRole="header" style={styles.pageTitle}>
            Your moments.
          </Text>
          <Text style={styles.body}>
            A record of your practice.{`\n`}Not a measure of your potential.
          </Text>
        </View>
        <View style={styles.progressStats}>
          <Hud label="ROUNDS" value={String(rows.length)} styles={styles} />
          <Hud
            label="PRACTICE TIME"
            value={`${Math.floor(rows.reduce((a, r) => a + r.durationMs, 0) / 60000)} min`}
            styles={styles}
          />
          <Hud
            label="LEVELS TRIED"
            value={String(new Set(rows.map((r) => r.levelId)).size)}
            styles={styles}
          />
        </View>
        {historyError && (
          <View style={styles.saveWarning}>
            <Text style={styles.body}>{historyError}</Text>
            <Text style={styles.mini}>
              Your existing history was not overwritten. Export or migrate it
              using your app’s storage tools.
            </Text>
          </View>
        )}
        {!rows.length ? (
          <View style={styles.empty}>
            <Text style={styles.resultSymbol}>✧</Text>
            <Text style={styles.h2}>One round is a good beginning.</Text>
            <Text style={styles.body}>
              Your personal bests will appear here.
            </Text>
            <Button
              label="Choose a moment →"
              onPress={() => setScreen("home")}
            />
          </View>
        ) : (
          <>
            <Text style={styles.h2}>Personal bests</Text>
            <Text style={styles.body}>
              Only like-for-like rounds, grouped by level.
            </Text>
            {LEVELS.filter((l) => rows.some((r) => r.levelId === l.id)).map(
              (l) => (
                <View style={styles.recordGroup} key={l.id}>
                  <Text style={styles.recordTitle}>
                    {GAME_NAMES[l.game]} · Level {l.number}
                  </Text>
                  <Text style={styles.mini}>{l.title}</Text>
                  <View style={styles.recordHeader}>
                    <Text style={styles.mini}>RANK / SCORE</Text>
                    <Text style={styles.mini}>
                      {l.game === "go"
                        ? "HIT / FALSE ALARM"
                        : "ACCURACY / TIME"}
                    </Text>
                  </View>
                  {bestForLevel(rows, l.id).map((r, i) => (
                    <View style={styles.recordRow} key={r.sessionId}>
                      <Text style={styles.recordText}>
                        {i === 0 ? "✦" : "·"} {i + 1} /{" "}
                        {r.metrics.score.toLocaleString()}
                      </Text>
                      <Text style={styles.recordText}>
                        {l.game === "go"
                          ? `${r.metrics.hitRate}% / ${r.metrics.falseAlarmRate}%`
                          : `${r.metrics.accuracy}% / ${(r.durationMs / 1000).toFixed(1)}s`}
                      </Text>
                    </View>
                  ))}
                </View>
              ),
            )}
          </>
        )}
        <View style={styles.ruleCard}>
          <Text style={styles.mini}>
            History is scoped to this app profile. Your host app controls
            encryption and account access. Up to 300 completed rounds are
            retained.
          </Text>
          <Button
            label={clearConfirm ? "Confirm clear history" : "Clear my history"}
            secondary
            onPress={() => {
              if (!clearConfirm) {
                setClearConfirm(true);
                return;
              }
              void repository
                .clear()
                .then(() => {
                  setRows([]);
                  setHistoryError(null);
                  setClearConfirm(false);
                })
                .catch(() =>
                  setHistoryError("Could not clear history. Please try again."),
                );
            }}
          />
        </View>
      </>
    );
  else
    body = (
      <View style={styles.empty}>
        <Text style={styles.body}>Preparing your moment…</Text>
      </View>
    );
  return (
    <FocusUIContext.Provider
      value={{ styles, screen, back, canExit: !!onExit }}
    >
      <SafeAreaView
        style={styles.safe}
        edges={["top", "bottom", "left", "right"]}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {error && (
            <View accessibilityRole="alert" style={styles.error}>
              <Text style={styles.body}>{error}</Text>
              <Button
                label="Retry connection"
                secondary
                onPress={() => {
                  const s = client.getSnapshot();
                  void dispatch(
                    s
                      ? { cmd: "poll", sessionId: s.sessionId }
                      : { cmd: "levels" },
                  );
                }}
              />
            </View>
          )}
          {body}
        </ScrollView>
      </SafeAreaView>
    </FocusUIContext.Provider>
  );
}
function formatRT(ms: number | null) {
  return ms === null ? "—" : `${(ms / 1000).toFixed(2)}s`;
}
function Hud({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.hudItem}>
      <Text style={styles.hudLabel}>{label}</Text>
      <Text style={styles.hudValue}>{value}</Text>
    </View>
  );
}
function GameArt({
  game,
  theme,
  large = false,
}: {
  game: Game;
  theme: FocusTheme;
  large?: boolean;
}) {
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View
      accessible={false}
      style={[
        styles.art,
        {
          backgroundColor:
            game === "stroop"
              ? theme.soft
              : game === "schulte"
                ? theme.peach
                : theme.blue,
        },
        large && styles.largeArt,
      ]}
    >
      {game === "stroop" ? (
        <>
          <View
            style={[styles.wordTile, { transform: [{ rotate: "-12deg" }] }]}
          >
            <Text
              style={[
                styles.artWord,
                { color: large ? INKS[1].hex : INKS[0].hex },
              ]}
            >
              {large ? "RED" : "BLUE"}
            </Text>
          </View>
          <View
            style={[
              styles.wordTile,
              styles.secondWord,
              { transform: [{ rotate: "8deg" }] },
            ]}
          >
            <Text style={[styles.artWord, { color: INKS[2].hex }]}>RED</Text>
          </View>
        </>
      ) : game === "schulte" ? (
        <View style={styles.artGrid}>
          {[8, 3, 6, 4, 1, 9, 2, 7, 5].map((n) => (
            <View
              key={n}
              style={[
                styles.artCell,
                n === 1 && { backgroundColor: "#BD9774" },
              ]}
            >
              <Text
                style={[styles.artDigit, n === 1 && { color: theme.surface }]}
              >
                {n}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.artCircle}>
          <Text style={styles.artLetter}>X</Text>
          <View style={styles.targetDot} />
        </View>
      )}
      <Text style={styles.artStar}>✧</Text>
    </View>
  );
}
function makeStyles(t: FocusTheme) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.background },
    scroll: { paddingHorizontal: 22, paddingBottom: 28, flexGrow: 1 },
    top: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 10,
      paddingBottom: 18,
      gap: 8,
    },
    back: { width: 44, height: 44, justifyContent: "center" },
    backText: { fontSize: 24, color: t.green },
    topLabel: {
      fontSize: 9,
      letterSpacing: 1.8,
      color: t.muted,
      flex: 1,
      textAlign: "center",
    },
    localDot: { flexDirection: "row", alignItems: "center", gap: 5 },
    dot: { height: 4, width: 4, borderRadius: 3, backgroundColor: "#9BAD87" },
    localText: { fontSize: 7, letterSpacing: 1, color: t.muted },
    intro: { paddingTop: 15, paddingBottom: 29 },
    eyebrow: {
      fontSize: 8,
      letterSpacing: 1.8,
      color: t.muted,
      fontWeight: "600",
      lineHeight: 15,
    },
    heroTitle: {
      fontFamily: t.serif,
      fontSize: 43,
      lineHeight: 49,
      letterSpacing: -1.4,
      color: t.ink,
      marginTop: 15,
      marginBottom: 16,
    },
    italic: { fontStyle: "italic", color: "#768E61" },
    body: { fontSize: 13, lineHeight: 22, color: t.muted },
    heroPills: {
      flexDirection: "row",
      gap: 9,
      marginTop: 20,
      flexWrap: "wrap",
    },
    pill: {
      alignSelf: "flex-start",
      color: "#7B8C6A",
      fontSize: 10,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: t.soft,
      overflow: "hidden",
    },
    sectionTitle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 17,
      gap: 9,
    },
    h2: {
      fontFamily: t.serif,
      color: t.ink,
      fontSize: 25,
      lineHeight: 32,
      letterSpacing: -0.5,
    },
    mini: { fontSize: 10, lineHeight: 18, color: t.muted },
    gameCard: {
      flexDirection: "row",
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 15,
      overflow: "hidden",
      marginBottom: 15,
      minHeight: 157,
    },
    gameCopy: { padding: 16, flex: 1 },
    gameNumber: {
      fontSize: 7.5,
      letterSpacing: 1.3,
      color: t.muted,
      marginBottom: 9,
      lineHeight: 12,
    },
    cardTitle: {
      fontFamily: t.serif,
      fontSize: 21,
      color: t.ink,
      letterSpacing: -0.4,
      marginBottom: 7,
    },
    cardDescription: { fontSize: 11, lineHeight: 18, color: t.muted },
    cardBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    },
    cardArrow: { fontSize: 22, color: "#839971" },
    art: {
      width: 108,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    largeArt: { width: 114, height: 133, borderRadius: 10 },
    wordTile: {
      backgroundColor: t.surface,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 7,
      marginBottom: 14,
    },
    secondWord: { position: "absolute", top: "57%", left: 28 },
    artWord: { fontSize: 17, fontWeight: "700", letterSpacing: 1.1 },
    artGrid: {
      width: 80,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      transform: [{ rotate: "-7deg" }],
    },
    artCell: {
      height: 23,
      width: 23,
      backgroundColor: t.surface,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    artDigit: { fontFamily: t.serif, fontSize: 14, color: "#A58C72" },
    artCircle: {
      height: 66,
      width: 66,
      borderRadius: 40,
      backgroundColor: t.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    artLetter: { fontSize: 37, color: "#75959B" },
    targetDot: {
      position: "absolute",
      bottom: 1,
      right: 2,
      height: 12,
      width: 12,
      borderRadius: 8,
      backgroundColor: "#90AB9C",
      borderWidth: 3,
      borderColor: t.blue,
    },
    artStar: {
      position: "absolute",
      right: 11,
      bottom: 15,
      color: "#A6B992",
      fontSize: 23,
    },
    journey: {
      marginTop: 11,
      backgroundColor: "#EEF2E5",
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
    },
    journeySymbol: {
      width: 36,
      height: 36,
      borderRadius: 9,
      backgroundColor: "#E2EBD5",
      justifyContent: "center",
      alignItems: "center",
    },
    journeyTitle: {
      fontFamily: t.serif,
      color: t.ink,
      fontSize: 19,
      marginTop: 5,
      marginBottom: 6,
    },
    footnote: {
      fontSize: 10,
      lineHeight: 18,
      color: t.muted,
      textAlign: "center",
      marginTop: 16,
      marginBottom: 7,
    },
    notesButton: {
      alignSelf: "center",
      minHeight: 44,
      justifyContent: "center",
      marginTop: 4,
    },
    notesText: { fontSize: 10, color: t.muted },
    noteCard: {
      padding: 18,
      backgroundColor: t.soft,
      borderRadius: 12,
      gap: 15,
    },
    levelIntro: { paddingTop: 14, paddingBottom: 24, gap: 12 },
    pageTitle: {
      fontFamily: t.serif,
      fontSize: 34,
      lineHeight: 42,
      letterSpacing: -1,
      color: t.ink,
    },
    levelBanner: {
      backgroundColor: t.soft,
      borderRadius: 13,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 17,
      marginTop: 11,
    },
    bannerTitle: {
      fontFamily: t.serif,
      color: t.ink,
      fontSize: 23,
      lineHeight: 28,
      marginBottom: 11,
    },
    levelGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    levelTile: {
      width: "48%",
      flexGrow: 1,
      flexBasis: "45%",
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 12,
      padding: 16,
      minHeight: 141,
    },
    completedTile: { backgroundColor: "#EDF3E4", borderColor: "#D9E3CC" },
    tileTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 13,
    },
    levelNumber: { fontFamily: t.serif, color: "#73865D", fontSize: 28 },
    tileMark: { color: "#8FA37C", fontSize: 15 },
    levelTitle: {
      fontFamily: t.serif,
      fontSize: 19,
      lineHeight: 24,
      color: t.ink,
      minHeight: 48,
    },
    levelDuration: {
      fontSize: 9,
      color: t.muted,
      marginTop: 9,
      lineHeight: 15,
    },
    demo: {
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      backgroundColor: t.surface,
      marginBottom: 28,
    },
    demoTitle: {
      fontFamily: t.serif,
      fontSize: 22,
      color: t.green,
      marginBottom: 10,
    },
    rule: {
      fontSize: 16,
      lineHeight: 25,
      color: t.ink,
      marginTop: 12,
      marginBottom: 20,
    },
    ruleCard: {
      backgroundColor: "#EDF1E5",
      borderRadius: 11,
      padding: 17,
      gap: 10,
      marginTop: 12,
    },
    startArea: { marginTop: 28, gap: 12 },
    button: {
      borderRadius: 9,
      backgroundColor: t.green,
      minHeight: 54,
      paddingHorizontal: 18,
      paddingVertical: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "500",
      color: t.surface,
      textAlign: "center",
    },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#D8E1CA",
    },
    secondaryText: { color: t.muted, fontSize: 12 },
    pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
    disabled: { opacity: 0.5 },
    playTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingTop: 14,
      marginBottom: 23,
    },
    roundControl: {
      width: 44,
      height: 44,
      borderRadius: 24,
      backgroundColor: t.soft,
      justifyContent: "center",
      alignItems: "center",
    },
    playSubtitle: {
      fontFamily: t.serif,
      fontSize: 19,
      color: t.ink,
      textAlign: "center",
      marginTop: 7,
      lineHeight: 26,
    },
    tinyLeaf: { fontSize: 25, color: "#A0B18B", width: 34 },
    hud: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: t.line,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 18,
      marginBottom: 20,
    },
    hudItem: { flex: 1, alignItems: "center", paddingHorizontal: 3 },
    hudLabel: {
      fontSize: 7,
      letterSpacing: 1.2,
      color: t.muted,
      marginBottom: 9,
      textAlign: "center",
    },
    hudValue: {
      fontSize: 22,
      color: t.ink,
      fontWeight: "500",
      textAlign: "center",
    },
    timerTrack: {
      height: 3,
      backgroundColor: "#DFE7D4",
      borderRadius: 2,
      overflow: "hidden",
      marginBottom: 24,
    },
    timerFill: { height: 3, width: "100%", backgroundColor: "#94AA7A" },
    stimulusCard: {
      height: 220,
      borderRadius: 16,
      backgroundColor: t.soft,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    stimulusPrompt: {
      position: "absolute",
      top: 21,
      fontSize: 8,
      letterSpacing: 1.5,
      color: t.muted,
      textAlign: "center",
    },
    stroopWord: {
      fontSize: 52,
      fontWeight: "700",
      letterSpacing: 1.8,
      paddingTop: 16,
    },
    letterCircle: {
      height: 122,
      width: 122,
      borderRadius: 65,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: "#D7E2CD",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 17,
    },
    otherLetter: { backgroundColor: "#FCF5EB", borderColor: "#EBDCC8" },
    goLetter: { fontSize: 69, color: "#6F9691", lineHeight: 85 },
    feedbackLine: {
      minHeight: 53,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    },
    feedbackText: {
      fontSize: 12,
      color: "#5C7748",
      textAlign: "center",
      lineHeight: 20,
    },
    noticeText: { color: t.notice },
    answers: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    answer: {
      width: "48%",
      flexBasis: "45%",
      flexGrow: 1,
      minHeight: 61,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 13,
    },
    inkDot: { width: 10, height: 10, borderRadius: 6 },
    answerText: { fontSize: 14, color: t.ink },
    nextPrompt: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 13,
      marginBottom: 12,
    },
    nextNumber: {
      minWidth: 43,
      minHeight: 43,
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: t.soft,
      textAlign: "center",
      textAlignVertical: "center",
      padding: 8,
      fontFamily: t.serif,
      fontSize: 26,
      color: t.green,
    },
    sequenceNote: {
      color: t.muted,
      fontSize: 10,
      lineHeight: 18,
      textAlign: "center",
      marginBottom: 13,
    },
    numberGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -3,
    },
    cell: {
      aspectRatio: 1,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    },
    cellText: { fontFamily: t.serif, color: t.green },
    foundCell: { backgroundColor: "#E4ECD8", borderColor: "#DAE4CC" },
    foundText: { color: "#96AA82" },
    pausePanel: { alignItems: "stretch", paddingTop: 32, gap: 21 },
    pauseIcon: {
      alignSelf: "center",
      textAlign: "center",
      textAlignVertical: "center",
      paddingTop: 22,
      width: 83,
      height: 83,
      borderRadius: 45,
      backgroundColor: t.soft,
      color: "#8AA16F",
      fontSize: 30,
      marginBottom: 4,
    },
    resultHero: { paddingTop: 26, alignItems: "center", gap: 12 },
    resultSymbol: {
      fontSize: 35,
      color: "#8CA674",
      backgroundColor: t.soft,
      padding: 14,
      width: 78,
      height: 78,
      textAlign: "center",
      borderRadius: 45,
      overflow: "hidden",
      marginBottom: 10,
    },
    resultScore: {
      fontFamily: t.serif,
      fontSize: 59,
      color: t.green,
      letterSpacing: -1,
      lineHeight: 72,
    },
    bestPill: {
      fontSize: 10,
      color: "#71875A",
      backgroundColor: t.soft,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 7,
      overflow: "hidden",
      textAlign: "center",
    },
    resultMetrics: {
      flexDirection: "row",
      gap: 8,
      marginTop: 29,
      marginBottom: 9,
    },
    metricCard: {
      flex: 1,
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 10,
      backgroundColor: t.surface,
      paddingHorizontal: 4,
      paddingVertical: 17,
      alignItems: "center",
      gap: 7,
    },
    metricValue: { fontSize: 21, color: t.ink, fontWeight: "500" },
    metricLabel: {
      fontSize: 8,
      lineHeight: 14,
      color: t.muted,
      textAlign: "center",
    },
    saveWarning: {
      backgroundColor: t.peach,
      borderRadius: 11,
      padding: 16,
      gap: 11,
      marginTop: 18,
    },
    progressStats: {
      flexDirection: "row",
      backgroundColor: t.soft,
      borderRadius: 12,
      paddingVertical: 22,
      marginBottom: 28,
    },
    empty: {
      paddingTop: 38,
      paddingBottom: 25,
      gap: 20,
      alignItems: "stretch",
    },
    recordGroup: {
      borderWidth: 1,
      borderColor: t.line,
      borderRadius: 12,
      backgroundColor: t.surface,
      padding: 17,
      marginTop: 20,
    },
    recordTitle: {
      fontFamily: t.serif,
      color: t.ink,
      fontSize: 19,
      marginBottom: 6,
    },
    recordHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 19,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: t.line,
    },
    recordRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      paddingTop: 14,
      paddingBottom: 7,
    },
    recordText: { fontSize: 11, color: t.ink, lineHeight: 19 },
    error: {
      backgroundColor: t.peach,
      padding: 16,
      borderRadius: 11,
      gap: 12,
      marginTop: 12,
    },
  });
}
