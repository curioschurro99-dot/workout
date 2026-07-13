import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dumbbell,
  Calendar,
  Library,
  TrendingUp,
  BookOpen,
  Sun,
  Apple,
  LogOut,
  Plus,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { useLocalStorage } from "./lib/store";
import {
  type Exercise,
  type Goal,
  type Note,
  type Program,
  type Unit,
  type WorkoutState,
  seedState,
  uid,
  SHAPES,
  POSES,
} from "./lib/workout-data";
import {
  type FoodItem,
  type MealSuggestion,
  type NutritionState,
  seedNutritionState,
} from "./lib/nutrition-data";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function WorkoutApp() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState("today");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [state, setState] = useLocalStorage<WorkoutState>(
    `workout_state_${user?.id || "anon"}`,
    seedState(),
  );

  const [nutritionState, setNutritionState] = useLocalStorage<NutritionState>(
    `workout_nutrition_${user?.id || "anon"}`,
    seedNutritionState(),
  );

  const [authForm, setAuthForm] = useState<"login" | "signup">("login");

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const updateState = (fn: (prev: WorkoutState) => WorkoutState) => {
    setState(fn);
  };

  const updateNutrition = (fn: (prev: NutritionState) => NutritionState) => {
    setNutritionState(fn);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-2xl font-['Oswald'] uppercase tracking-wider text-bone">
              Workout
            </div>
            <div className="text-xs uppercase tracking-[0.08em] text-bone-dim mt-1">
              Training Log
            </div>
          </div>
          {authForm === "login" ? (
            <LoginPage onSwitch={() => setAuthForm("signup")} />
          ) : (
            <SignupPage onSwitch={() => setAuthForm("login")} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row">
      {/* Rail / Sidebar */}
      <div className="lg:w-[220px] bg-surface border-b lg:border-b-0 lg:border-r border-line flex lg:flex-col shrink-0 overflow-x-auto">
        <div className="hidden lg:block px-5 pb-5 border-b border-line mb-4">
          <div className="text-[22px] font-['Oswald'] uppercase tracking-wider text-bone leading-tight">
            Workout
          </div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-bone-dim mt-1">
            Training Log
          </div>
        </div>
        {[
          { id: "today", label: "Today", icon: Calendar },
          { id: "programs", label: "Programs", icon: Dumbbell },
          { id: "library", label: "Library", icon: Library },
          { id: "progress", label: "Progress", icon: TrendingUp },
          { id: "knowledge", label: "Knowledge", icon: BookOpen },
          { id: "yoga", label: "Yoga", icon: Sun },
          { id: "nutrition", label: "Nutrition", icon: Apple },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex items-center gap-3 px-5 py-3 text-[13px] uppercase tracking-[0.05em] font-medium transition-colors
              border-l-3 lg:border-l-3 lg:border-b-0 border-b-3
              ${
                view === tab.id
                  ? "text-bone bg-surface-2 border-brass"
                  : "text-bone-dim border-transparent hover:text-bone hover:bg-white/[0.02]"
              }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="lg:inline">{tab.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-5 py-3 text-[13px] uppercase tracking-[0.05em] text-bone-dim hover:text-bone border-l-3 border-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 lg:p-9 max-w-[1100px] overflow-y-auto">
        {view === "today" && (
          <TodayView
            state={state}
            updateState={updateState}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        {view === "programs" && (
          <ProgramsView
            state={state}
            updateState={updateState}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        {view === "library" && (
          <LibraryView
            state={state}
            updateState={updateState}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        {view === "progress" && (
          <ProgressView
            state={state}
            updateState={updateState}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        {view === "knowledge" && (
          <KnowledgeView
            state={state}
            updateState={updateState}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        {view === "yoga" && <YogaView openModal={openModal} closeModal={closeModal} />}
        {view === "nutrition" && (
          <NutritionView nutritionState={nutritionState} updateNutrition={updateNutrition} />
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-[rgba(10,12,10,0.7)] z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-surface border border-line rounded-[10px] p-6 w-[420px] max-w-[92vw] max-h-[85vh] overflow-y-auto">
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== TODAY VIEW ==================== */
function TodayView({
  state,
  updateState,
  openModal: _openModal,
  closeModal: _closeModal,
}: {
  state: WorkoutState;
  updateState: (fn: (prev: WorkoutState) => WorkoutState) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  const prog = state.programs.find((p) => p.id === state.activeProgramId);
  const today = new Date().toISOString().slice(0, 10);

  const strip = (
    <div className="flex gap-2 flex-wrap mb-5">
      {prog?.days.map((d, i) => (
        <button
          key={i}
          onClick={() => updateState((s) => ({ ...s, activeDayIndex: i }))}
          className={`px-3.5 py-2 rounded-md border text-xs uppercase tracking-[0.04em]
            ${
              i === state.activeDayIndex
                ? "border-brass text-brass bg-brass/10"
                : "border-line text-bone-dim"
            }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  );

  const day = prog?.days[state.activeDayIndex];

  const checkKey = `${prog?.id}_${state.activeDayIndex}_${today}`;
  const checks = state.checks[checkKey] || {};

  const toggleCheck = (idx: number) => {
    const newChecks = { ...state.checks };
    if (!newChecks[checkKey]) newChecks[checkKey] = {};
    newChecks[checkKey][idx] = !newChecks[checkKey][idx];
    updateState((s) => ({ ...s, checks: newChecks }));
  };

  const logSession = () => {
    if (!prog || !day) return;
    updateState((s) => ({
      ...s,
      logs: [
        ...s.logs,
        {
          date: today,
          programId: prog.id,
          dayLabel: day.label,
          focus: day.focus,
          exCount: day.exercises.length,
        },
      ],
    }));
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">
            {prog ? prog.name : "Today"}
          </h1>
          <div className="text-sm text-bone-dim mt-1.5 max-w-[520px]">
            {prog ? prog.desc : "Pick an active program to see your workout for today."}
          </div>
        </div>
      </div>

      {prog && strip}

      <div className="bg-surface border border-line rounded-[10px] p-5">
        {!prog && (
          <div className="text-center text-bone-dim text-sm py-5">
            No active program yet. Go to <b>Programs</b> to start one.
          </div>
        )}
        {prog && (!day || day.exercises.length === 0) && (
          <>
            <h3 className="text-brass text-sm uppercase tracking-[0.05em] mb-2">
              {day?.focus || "Rest Day"}
            </h3>
            <div className="text-bone-dim text-sm py-3">
              Rest day. Recovery is part of the plan.
            </div>
          </>
        )}
        {prog && day && day.exercises.length > 0 && (
          <>
            <h3 className="text-brass text-sm uppercase tracking-[0.05em] mb-4">{day.focus}</h3>
            {day.exercises.map((pe, i) => {
              const ex = state.exercises.find((e) => e.id === pe.exId);
              if (!ex) return null;
              const checked = checks[i];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3.5 py-3.5 border-b border-line last:border-b-0"
                >
                  <button
                    onClick={() => toggleCheck(i)}
                    className={`w-[22px] h-[22px] rounded-[5px] border-2 flex items-center justify-center shrink-0 text-sm
                      ${checked ? "bg-moss border-moss text-[#0e150f]" : "border-line text-transparent"}`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-bone">{ex.name}</div>
                    <div className="text-xs text-bone-dim mt-0.5">
                      {ex.muscle} &middot; {pe.sets} sets &times; {pe.reps} {ex.unit}
                      {ex.note && <span> &middot; {ex.note}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={logSession}
              className="mt-4 bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
            >
              <CheckCircle className="w-4 h-4 inline mr-1.5" />
              Log Session Complete
            </button>
          </>
        )}
      </div>

      {/* Timer */}
      <TimerCard />
    </>
  );
}

/* ==================== TIMER ==================== */
function TimerCard() {
  const [work, setWork] = useState(40);
  const [rest, setRest] = useState(20);
  const [rounds, setRounds] = useState(5);
  const [phase, setPhase] = useState<"work" | "rest" | "idle">("idle");
  const [round, setRound] = useState(1);
  const [remaining, setRemaining] = useState(40);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const beep = () => {
    try {
      const ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      /* ignore */
    }
  };

  const start = () => {
    if (running) return;
    if (remaining <= 0 || phase === "idle") {
      setPhase("work");
      setRound(1);
      setRemaining(work);
    }
    setRunning(true);
  };

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) return prev - 1;
        beep();
        if (phase === "work") {
          setPhase("rest");
          return rest;
        } else {
          if (round >= rounds) {
            setRunning(false);
            setPhase("idle");
            return 0;
          }
          setRound((r) => r + 1);
          setPhase("work");
          return work;
        }
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phase, round, work, rest, rounds]);

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRound(1);
    setPhase("work");
    setRemaining(work);
  };

  return (
    <div className="bg-surface border border-line rounded-[10px] p-5 mt-4">
      <div className="text-xs uppercase tracking-[0.15em] text-bone-dim text-center mb-1">
        Interval Timer
      </div>
      <div className="flex justify-center gap-4 mb-2">
        <div className="w-[90px]">
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Work (s)
          </label>
          <input
            type="number"
            value={work}
            onChange={(e) => setWork(Number(e.target.value))}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm text-center"
          />
        </div>
        <div className="w-[90px]">
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Rest (s)
          </label>
          <input
            type="number"
            value={rest}
            onChange={(e) => setRest(Number(e.target.value))}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm text-center"
          />
        </div>
        <div className="w-[90px]">
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Rounds
          </label>
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm text-center"
          />
        </div>
      </div>
      <div className="text-xs uppercase tracking-[0.15em] text-bone-dim text-center mb-1">
        {phase === "idle"
          ? "Ready"
          : `${phase === "work" ? "Work" : "Rest"} — Round ${round}/${rounds}`}
      </div>
      <div
        className={`font-['IBM_Plex_Mono'] text-5xl lg:text-6xl font-semibold text-center py-4 tracking-[0.02em]
        ${phase === "rest" ? "text-moss" : "text-brass"}`}
      >
        {fmt(remaining)}
      </div>
      <div className="flex gap-2.5 justify-center mt-3.5">
        <button
          onClick={start}
          className="bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
        >
          <Play className="w-3.5 h-3.5 inline mr-1" /> Start
        </button>
        <button
          onClick={pause}
          className="bg-transparent text-bone border border-line px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:border-brass hover:text-brass"
        >
          <Pause className="w-3.5 h-3.5 inline mr-1" /> Pause
        </button>
        <button
          onClick={reset}
          className="bg-transparent text-bone border border-line px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:border-brass hover:text-brass"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset
        </button>
      </div>
    </div>
  );
}

/* ==================== PROGRAMS VIEW ==================== */
function ProgramsView({
  state,
  updateState,
  openModal,
  closeModal,
}: {
  state: WorkoutState;
  updateState: (fn: (prev: WorkoutState) => WorkoutState) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  return (
    <>
      <div className="flex justify-between items-end flex-wrap gap-3 mb-7">
        <div>
          <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">
            Programs
          </h1>
          <div className="text-sm text-bone-dim mt-1.5 max-w-[520px]">
            Build a routine day by day, or use the pre-loaded 7-Day Recomposition Plan.
          </div>
        </div>
        <button
          onClick={() => {
            openModal(
              <NewProgramForm
                onSave={(name, desc) => {
                  updateState((s) => ({
                    ...s,
                    programs: [...s.programs, { id: uid(), name, desc, days: [] }],
                  }));
                  closeModal();
                }}
              />,
            );
          }}
          className="bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
        >
          <Plus className="w-4 h-4 inline mr-1" /> New Program
        </button>
      </div>

      <div className="space-y-3.5">
        {state.programs.map((p) => (
          <div
            key={p.id}
            className={`bg-surface border rounded-[10px] p-5 cursor-pointer transition-colors hover:border-brass-dim
              ${p.id === state.activeProgramId ? "border-brass" : "border-line"}`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h2 className="text-lg text-bone font-['Oswald']">{p.name}</h2>
                <div className="text-sm text-bone-dim mt-1 max-w-[500px]">{p.desc}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                {p.id === state.activeProgramId ? (
                  <span className="text-[10px] uppercase tracking-[0.05em] px-2 py-1 rounded-full border border-brass text-brass">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateState((s) => ({ ...s, activeProgramId: p.id, activeDayIndex: 0 }));
                    }}
                    className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-3 py-1.5 rounded-md hover:border-brass hover:text-brass"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(
                      <AddDayForm
                        program={p}
                        exercises={state.exercises}
                        onSave={(label, focus, exercises) => {
                          updateState((s) => ({
                            ...s,
                            programs: s.programs.map((prog) =>
                              prog.id === p.id
                                ? { ...prog, days: [...prog.days, { label, focus, exercises }] }
                                : prog,
                            ),
                          }));
                          closeModal();
                        }}
                      />,
                    );
                  }}
                  className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-3 py-1.5 rounded-md hover:border-brass hover:text-brass"
                >
                  <Plus className="w-3 h-3 inline mr-0.5" /> Day
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!confirm("Delete this program?")) return;
                    updateState((s) => {
                      const filtered = s.programs.filter((prog) => prog.id !== p.id);
                      return {
                        ...s,
                        programs: filtered,
                        activeProgramId:
                          s.activeProgramId === p.id ? filtered[0]?.id || null : s.activeProgramId,
                      };
                    });
                  }}
                  className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-danger border border-danger px-3 py-1.5 rounded-md hover:opacity-80"
                >
                  <X className="w-3 h-3 inline mr-0.5" /> Delete
                </button>
              </div>
            </div>
            <div className="mt-3.5 space-y-2.5">
              {p.days.map((d, i) => (
                <div key={i} className="border border-line rounded-lg p-3.5">
                  <h3 className="text-sm text-brass mb-2">
                    {d.label} &mdash; {d.focus}
                  </h3>
                  <div className="text-sm text-bone-dim space-y-1">
                    {d.exercises.length > 0 ? (
                      d.exercises.map((pe, j) => {
                        const ex = state.exercises.find((e) => e.id === pe.exId);
                        return ex ? (
                          <div key={j}>
                            {ex.name} &mdash; {pe.sets}&times;{pe.reps} {ex.unit}
                          </div>
                        ) : null;
                      })
                    ) : (
                      <div>Rest</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function NewProgramForm({ onSave }: { onSave: (name: string, desc: string) => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <>
      <h2 className="text-lg font-['Oswald'] text-bone mb-4">New Program</h2>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Program Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Custom Split"
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={2}
          placeholder="What is this program for?"
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <button
        onClick={() => {
          if (!name.trim()) return;
          onSave(name.trim(), desc.trim());
        }}
        className="bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
      >
        Create
      </button>
    </>
  );
}

function AddDayForm({
  program,
  exercises,
  onSave,
}: {
  program: Program;
  exercises: Exercise[];
  onSave: (
    label: string,
    focus: string,
    exercises: { exId: string; sets: number; reps: number }[],
  ) => void;
}) {
  const [label, setLabel] = useState(`Day ${program.days.length + 1}`);
  const [focus, setFocus] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return (
    <>
      <h2 className="text-lg font-['Oswald'] text-bone mb-4">Add Day to {program.name}</h2>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Day Label
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Focus
        </label>
        <input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="e.g. Lower Body Strength"
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Exercises
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {exercises.map((ex) => (
            <label
              key={ex.id}
              className="flex items-center gap-2 text-sm text-bone-dim cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(ex.id)}
                onChange={() => toggle(ex.id)}
                className="accent-brass"
              />
              {ex.name}
            </label>
          ))}
        </div>
        <div className="text-[11px] text-bone-dim mt-1">Leave empty for a rest day.</div>
      </div>
      <button
        onClick={() => {
          const dayExercises = selected.map((id) => {
            const e = exercises.find((x) => x.id === id);
            return { exId: id, sets: e?.sets || 3, reps: e?.reps || 10 };
          });
          onSave(
            label.trim() || `Day ${program.days.length + 1}`,
            focus.trim() || "Rest",
            dayExercises,
          );
        }}
        className="bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
      >
        Add Day
      </button>
    </>
  );
}

/* ==================== LIBRARY VIEW ==================== */
function LibraryView({
  state,
  updateState,
  openModal,
  closeModal,
}: {
  state: WorkoutState;
  updateState: (fn: (prev: WorkoutState) => WorkoutState) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? state.exercises : state.exercises.filter((e) => e.cat === filter);

  return (
    <>
      <div className="flex justify-between items-end flex-wrap gap-3 mb-7">
        <div>
          <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">
            Library
          </h1>
          <div className="text-sm text-bone-dim mt-1.5 max-w-[520px]">
            Every exercise available to add into a program.
          </div>
        </div>
        <button
          onClick={() => {
            openModal(
              <NewExerciseForm
                onSave={(ex) => {
                  updateState((s) => ({ ...s, exercises: [...s.exercises, ex] }));
                  closeModal();
                }}
              />,
            );
          }}
          className="bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
        >
          <Plus className="w-4 h-4 inline mr-1" /> Add Exercise
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "strength", "cardio", "mobility"].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${filter === c ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="flex justify-between items-center gap-3 py-3.5 border-b border-line last:border-b-0"
          >
            <div className="min-w-0">
              <div className="font-semibold text-sm text-bone">
                {ex.name}
                <span
                  className={`text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border ml-2
                  ${ex.cat === "strength" ? "border-brass-dim text-brass" : ""}
                  ${ex.cat === "cardio" ? "border-[#8a4c46] text-[#d97e6f]" : ""}
                  ${ex.cat === "mobility" ? "border-moss-dim text-moss" : ""}`}
                >
                  {ex.cat}
                </span>
              </div>
              <div className="text-xs text-bone-dim mt-0.5">
                {ex.muscle} &middot; default {ex.sets}&times;{ex.reps} {ex.unit}
                {ex.note && <span> &middot; {ex.note}</span>}
              </div>
            </div>
            <button
              onClick={() => {
                if (!confirm("Remove this exercise?")) return;
                updateState((s) => ({
                  ...s,
                  exercises: s.exercises.filter((e) => e.id !== ex.id),
                }));
              }}
              className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-danger border border-danger px-2.5 py-1 rounded-md hover:opacity-80 shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-bone-dim text-sm py-5">
            No exercises in this category.
          </div>
        )}
      </div>
    </>
  );
}

function NewExerciseForm({ onSave }: { onSave: (ex: Exercise) => void }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState<"strength" | "cardio" | "mobility">("strength");
  const [muscle, setMuscle] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [unit, setUnit] = useState<Unit>("reps");
  const [note, setNote] = useState("");
  return (
    <>
      <h2 className="text-lg font-['Oswald'] text-bone mb-4">Add Exercise</h2>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Category
          </label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as typeof cat)}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="mobility">Mobility</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Muscle / Focus
          </label>
          <input
            value={muscle}
            onChange={(e) => setMuscle(e.target.value)}
            placeholder="e.g. Legs"
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Default Sets
          </label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Default Reps
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
          >
            <option value="reps">Reps</option>
            <option value="sec">Seconds</option>
            <option value="m">Meters</option>
            <option value="steps">Steps</option>
            <option value="min">Minutes</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Note (optional)
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <button
        onClick={() => {
          if (!name.trim()) return;
          onSave({
            id: uid(),
            name: name.trim(),
            cat,
            muscle: muscle.trim() || "General",
            sets,
            reps,
            unit,
            note: note.trim() || undefined,
          });
        }}
        className="bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
      >
        Add to Library
      </button>
    </>
  );
}

function ProgressView({
  state,
  updateState,
  openModal,
  closeModal,
}: {
  state: WorkoutState;
  updateState: (fn: (prev: WorkoutState) => WorkoutState) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  const logs = state.logs;
  const total = logs.length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekCount = logs.filter((l) => new Date(l.date) >= oneWeekAgo).length;

  const dateSet = new Set(logs.map((l) => l.date));
  let streak = 0;
  const d = new Date();
  while (dateSet.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const g = state.goal;
  const pct = g.weeklyTarget ? Math.min(100, Math.round((weekCount / g.weeklyTarget) * 100)) : 0;

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">Progress</h1>
        <div className="text-sm text-bone-dim mt-1.5">
          Goals, streaks, and your session history.
        </div>
      </div>

      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-4 mb-4">
        {[
          { num: streak, label: "Day Streak" },
          { num: total, label: "Sessions Logged" },
          { num: weekCount, label: "This Week" },
        ].map((s, i) => (
          <div key={i} className="bg-surface border border-line rounded-[10px] p-4 text-center">
            <div className="font-['IBM_Plex_Mono'] text-3xl text-brass">{s.num}</div>
            <div className="text-[11px] uppercase tracking-[0.05em] text-bone-dim mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-brass uppercase tracking-[0.05em]">Goal</h3>
          <button
            onClick={() => {
              openModal(
                <EditGoalForm
                  goal={g}
                  onSave={(goal) => {
                    updateState((s) => ({ ...s, goal }));
                    closeModal();
                  }}
                />,
              );
            }}
            className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2.5 py-1 rounded-md hover:border-brass hover:text-brass"
          >
            Edit
          </button>
        </div>
        <div className="mt-2.5">
          <div className="text-sm text-bone-dim mb-2">
            {g.targetWeight && (
              <>
                Target weight: <b className="text-bone">{g.targetWeight}kg</b> &middot;{" "}
              </>
            )}
            Weekly target: <b className="text-bone">{g.weeklyTarget} sessions</b>
            {g.notes && <div className="mt-1.5">{g.notes}</div>}
          </div>
          <div className="h-2 bg-bg rounded-full overflow-hidden border border-line">
            <div
              className="h-full bg-gradient-to-r from-brass-dim to-brass transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[11px] text-bone-dim mt-1">
            {weekCount}/{g.weeklyTarget} sessions this week
          </div>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5">
        <h3 className="text-sm text-brass uppercase tracking-[0.05em] mb-3">History</h3>
        {logs.length === 0 ? (
          <div className="text-center text-bone-dim text-sm py-5">No sessions logged yet.</div>
        ) : (
          <div>
            {logs
              .slice()
              .reverse()
              .slice(0, 30)
              .map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 py-3.5 border-b border-line last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-bone">
                      {l.dayLabel} &mdash; {l.focus}
                    </div>
                    <div className="text-xs text-bone-dim mt-0.5">
                      {l.date} &middot; {l.exCount} exercises
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

function EditGoalForm({ goal, onSave }: { goal: Goal; onSave: (goal: Goal) => void }) {
  const [targetWeight, setTargetWeight] = useState(goal.targetWeight);
  const [weeklyTarget, setWeeklyTarget] = useState(goal.weeklyTarget);
  const [notes, setNotes] = useState(goal.notes);
  return (
    <>
      <h2 className="text-lg font-['Oswald'] text-bone mb-4">Edit Goal</h2>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Target Weight (kg, optional)
        </label>
        <input
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(e.target.value)}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Weekly Session Target
        </label>
        <input
          type="number"
          value={weeklyTarget}
          onChange={(e) => setWeeklyTarget(Number(e.target.value))}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <button
        onClick={() => onSave({ targetWeight, weeklyTarget, notes, startDate: goal.startDate })}
        className="bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
      >
        Save Goal
      </button>
    </>
  );
}

function KnowledgeView({
  state,
  updateState,
  openModal,
  closeModal,
}: {
  state: WorkoutState;
  updateState: (fn: (prev: WorkoutState) => WorkoutState) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">
          Knowledge
        </h1>
        <div className="text-sm text-bone-dim mt-1.5">
          Reference notes &mdash; why the plan is built this way.
        </div>
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5 space-y-4 mb-4">
        <div>
          <h3 className="text-sm text-brass mb-2">Recomposition, not one-then-the-other</h3>
          <p className="text-sm text-bone-dim leading-relaxed">
            You don't need to build muscle first and lose fat later. Training for strength while
            eating in a modest calorie deficit lets a beginner lose fat and build muscle at the same
            time &mdash; the response to new training stimulus is fastest in the first few months.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-brass mb-2">Strength before pure cardio</h3>
          <p className="text-sm text-bone-dim leading-relaxed">
            HIIT burns calories short-term. Strength training builds the muscle that raises resting
            metabolism long-term and shapes the body. Starting split: 4 strength days, 1&ndash;2
            light cardio/HIIT days, rest days built in.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-brass mb-2">
            Protein &amp; calories matter more than the workout
          </h3>
          <p className="text-sm text-bone-dim leading-relaxed">
            Fat loss needs a calorie deficit; muscle building needs enough protein &mdash; roughly
            1.2&ndash;1.6g per kg of bodyweight is a common target &mdash; plus enough total food to
            fuel the sessions. Moderate deficit, adequate protein, is the combination that lets both
            happen together.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-brass mb-2">Choosing a starting dumbbell weight</h3>
          <p className="text-sm text-bone-dim leading-relaxed">
            The right weight is one where the last 2&ndash;3 reps of a set feel hard but form stays
            clean. Breezing through with no fatigue: go up. Form breaking down before the set ends:
            go lighter. Starting points for a smaller frame &mdash; goblet squats 4&ndash;6kg, rows
            3&ndash;4kg, shoulder press 2&ndash;3kg, curls 2&ndash;3kg per hand.
          </p>
        </div>
        <div>
          <h3 className="text-sm text-brass mb-2">Progression rule</h3>
          <p className="text-sm text-bone-dim leading-relaxed">
            When a rep range feels easy for two sessions in a row, add weight or reps. Consistency
            across 8&ndash;12 weeks matters more than intensity in week one.
          </p>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm text-brass uppercase tracking-[0.05em]">My Notes</h3>
          <button
            onClick={() => {
              openModal(
                <AddNoteForm
                  onSave={(note) => {
                    updateState((s) => ({ ...s, myNotes: [...s.myNotes, note] }));
                    closeModal();
                  }}
                />,
              );
            }}
            className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2.5 py-1 rounded-md hover:border-brass hover:text-brass"
          >
            <Plus className="w-3 h-3 inline mr-0.5" /> Add Note
          </button>
        </div>
        {state.myNotes.length === 0 ? (
          <div className="text-center text-bone-dim text-sm py-5">No personal notes yet.</div>
        ) : (
          <div className="space-y-3">
            {state.myNotes.map((n, i) => (
              <div key={i}>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm text-brass">{n.title || "Note"}</h3>
                  <button
                    onClick={() =>
                      updateState((s) => ({ ...s, myNotes: s.myNotes.filter((_, j) => j !== i) }))
                    }
                    className="text-[11px] text-danger hover:opacity-80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-bone-dim mt-1">{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function AddNoteForm({ onSave }: { onSave: (note: Note) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <>
      <h2 className="text-lg font-['Oswald'] text-bone mb-4">Add Note</h2>
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">
          Note
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <button
        onClick={() => {
          if (!body.trim()) return;
          onSave({ title: title.trim(), body: body.trim() });
        }}
        className="bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
      >
        Save Note
      </button>
    </>
  );
}

/* ==================== YOGA VIEW ==================== */
function YogaView({
  openModal,
  closeModal: _closeModal,
}: {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}) {
  const [filter, setFilter] = useState("all");
  const [inSequence, setInSequence] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0);
  const [seqRemaining, setSeqRemaining] = useState(0);
  const [seqRunning, setSeqRunning] = useState(false);
  const [voiceCoach, setVoiceCoach] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const seqIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sequence = POSES.filter((p) => p.seq).sort((a, b) => (a.seq || 0) - (b.seq || 0));

  const cats = [
    "all",
    "Standing",
    "Balance",
    "Backbend",
    "Forward Fold",
    "Twist",
    "Hip Opener",
    "Core",
    "Restorative",
  ];
  const filtered = filter === "all" ? POSES : POSES.filter((p) => p.category === filter);

  const speak = useCallback(
    (text: string) => {
      if (!voiceCoach || !("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      speechSynthesis.speak(u);
    },
    [voiceCoach],
  );

  const goToPose = useCallback(
    (idx: number) => {
      if (seqIntervalRef.current) clearInterval(seqIntervalRef.current);
      speechSynthesis.cancel();
      if (idx < 0 || idx >= sequence.length) {
        setSeqIndex(idx);
        setSeqRunning(false);
        return;
      }
      const p = sequence[idx];
      setSeqIndex(idx);
      setSeqRemaining(p.hold);
      setSeqRunning(true);
      speak(`${p.name}. ${p.cue}`);
    },
    [sequence, speak],
  );

  useEffect(() => {
    if (!seqRunning) {
      if (seqIntervalRef.current) clearInterval(seqIntervalRef.current);
      return;
    }
    seqIntervalRef.current = setInterval(() => {
      setSeqRemaining((prev) => {
        if (prev <= 1) {
          if (seqIndex >= sequence.length - 1) {
            setSeqRunning(false);
            return 0;
          }
          goToPose(seqIndex + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (seqIntervalRef.current) clearInterval(seqIntervalRef.current);
    };
  }, [seqRunning, seqIndex, sequence.length, goToPose]);

  const extractYoutubeId = (url: string) => {
    const m = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    );
    return m ? m[1] : null;
  };

  const videoId = extractYoutubeId(videoUrl);

  if (inSequence) {
    const pose = seqIndex < sequence.length ? sequence[seqIndex] : null;
    return (
      <>
        <div className="mb-7">
          <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">
            Yoga Flow
          </h1>
        </div>

        {/* Video panel */}
        <div className="bg-surface border border-line rounded-[10px] p-4 mb-4">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-sm text-brass uppercase tracking-[0.05em]">
              Follow a Real Instructor (optional)
            </h3>
            <button
              onClick={() => setVideoUrl("")}
              className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass"
            >
              Clear
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste a YouTube link..."
              className="flex-1 bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
            />
          </div>
          {videoId && (
            <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-line">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Voice toggle */}
        <div className="flex justify-center items-center gap-4 mb-3.5">
          <label className="flex items-center gap-2 text-xs text-bone-dim uppercase tracking-[0.04em] cursor-pointer">
            <input
              type="checkbox"
              checked={voiceCoach}
              onChange={(e) => setVoiceCoach(e.target.checked)}
              className="w-4 h-4 accent-brass"
            />
            Voice Coach (spoken cues)
          </label>
        </div>

        {pose ? (
          <>
            <div className="font-['IBM_Plex_Mono'] text-xs text-bone-dim tracking-[0.05em] mb-2.5">
              Posture {seqIndex + 1}/{sequence.length}
            </div>
            <div className="h-1.5 bg-bg rounded-full overflow-hidden border border-line mb-4 max-w-[440px] mx-auto">
              <div
                className="h-full bg-brass transition-all"
                style={{ width: `${(seqIndex / sequence.length) * 100}%` }}
              />
            </div>
            <div className="bg-surface border border-line rounded-[10px] p-8 text-center">
              <svg viewBox="0 0 90 90" className="w-36 h-36 mx-auto text-brass">
                {SHAPES[pose.shape] && (
                  <g dangerouslySetInnerHTML={{ __html: SHAPES[pose.shape] }} />
                )}
              </svg>
              <div className="text-2xl font-['Oswald'] uppercase tracking-wider text-bone mt-2.5">
                {pose.name}
              </div>
              <div className="text-sm text-brass italic mt-0.5">{pose.sanskrit}</div>
              <div className="font-['IBM_Plex_Mono'] text-4xl text-brass mt-4">{seqRemaining}</div>
              <div className="text-sm text-bone-dim max-w-[440px] mx-auto mt-3.5 leading-relaxed">
                {pose.cue}
              </div>
            </div>
            <div className="flex gap-2.5 justify-center mt-5 flex-wrap">
              <button
                onClick={() => goToPose(seqIndex - 1)}
                className="bg-transparent text-bone border border-line px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:border-brass hover:text-brass"
              >
                <ChevronLeft className="w-3.5 h-3.5 inline mr-1" /> Prev
              </button>
              <button
                onClick={() => setSeqRunning((r) => !r)}
                className={`px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold
                  ${seqRunning ? "bg-brass text-[#1a1408] hover:bg-[#d69a4e]" : "bg-transparent text-bone border border-line hover:border-brass hover:text-brass"}`}
              >
                {seqRunning ? (
                  <Pause className="w-3.5 h-3.5 inline mr-1" />
                ) : (
                  <Play className="w-3.5 h-3.5 inline mr-1" />
                )}
                {seqRunning ? "Pause" : "Resume"}
              </button>
              <button
                onClick={() => goToPose(seqIndex + 1)}
                className="bg-transparent text-bone border border-line px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:border-brass hover:text-brass"
              >
                Next <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
              </button>
              <button
                onClick={() => {
                  setInSequence(false);
                  setSeqRunning(false);
                  speechSynthesis.cancel();
                  if (seqIntervalRef.current) clearInterval(seqIntervalRef.current);
                }}
                className="bg-transparent text-danger border border-danger px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:opacity-80"
              >
                Exit Flow
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="font-['Oswald'] text-2xl text-brass mb-2">Flow Complete</div>
            <p className="text-sm text-bone-dim">
              Nice work &mdash; that's the full 26-posture flow. Rest in Savasana as long as you
              like.
            </p>
            <button
              onClick={() => setInSequence(false)}
              className="mt-4 bg-transparent text-bone border border-line px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:border-brass hover:text-brass"
            >
              Back to Library
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-end flex-wrap gap-3 mb-7">
        <div>
          <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">Yoga</h1>
          <div className="text-sm text-bone-dim mt-1.5 max-w-[520px]">
            50 poses across standing, backbend, forward fold, twist, balance, hip-opener, core and
            restorative.
          </div>
        </div>
        <button
          onClick={() => {
            setInSequence(true);
            setSeqIndex(0);
            setSeqRemaining(sequence[0]?.hold || 30);
          }}
          className="bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]"
        >
          <Play className="w-4 h-4 inline mr-1" /> Start Guided Hot Yoga Flow
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${filter === c ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3.5">
        {filtered.map((pose, i) => (
          <button
            key={i}
            onClick={() => {
              openModal(
                <div className="text-center">
                  <svg viewBox="0 0 90 90" className="w-28 h-28 mx-auto text-brass">
                    {SHAPES[pose.shape] && (
                      <g dangerouslySetInnerHTML={{ __html: SHAPES[pose.shape] }} />
                    )}
                  </svg>
                  <h2 className="text-lg font-['Oswald'] text-bone mt-2.5">{pose.name}</h2>
                  <div className="text-sm text-brass italic mb-2.5">{pose.sanskrit}</div>
                  <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border border-line text-bone-dim">
                      {pose.category}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.04em] px-2 py-0.5 rounded-full border
                      ${pose.difficulty === "Beginner" ? "border-moss-dim text-moss" : ""}
                      ${pose.difficulty === "Intermediate" ? "border-brass-dim text-brass" : ""}
                      ${pose.difficulty === "Advanced" ? "border-[#8a4c46] text-[#d97e6f]" : ""}`}
                    >
                      {pose.difficulty}
                    </span>
                    <span className="text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full border border-line text-bone-dim">
                      ~{pose.hold}s hold
                    </span>
                  </div>
                  <p className="text-sm text-bone-dim leading-relaxed">{pose.cue}</p>
                  <p className="text-xs text-bone-dim mt-2">
                    <b className="text-bone">Focus:</b> {pose.focus}
                  </p>
                </div>,
              );
            }}
            className="bg-surface border border-line rounded-[10px] p-3.5 text-center cursor-pointer transition-colors hover:border-brass-dim relative"
          >
            {pose.seq && (
              <div className="absolute top-2.5 left-2.5 font-['IBM_Plex_Mono'] text-[10px] text-brass-dim">
                #{pose.seq}
              </div>
            )}
            <svg viewBox="0 0 90 90" className="w-20 h-20 mx-auto text-brass">
              {SHAPES[pose.shape] && <g dangerouslySetInnerHTML={{ __html: SHAPES[pose.shape] }} />}
            </svg>
            <div className="font-semibold text-sm text-bone mt-2">{pose.name}</div>
            <div className="text-[10px] text-brass italic mt-0.5">{pose.sanskrit}</div>
            <div className="text-sm text-bone-dim mt-1 leading-relaxed">{pose.focus}</div>
            <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border border-line text-bone-dim">
                {pose.category}
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.04em] px-2 py-0.5 rounded-full border
                ${pose.difficulty === "Beginner" ? "border-moss-dim text-moss" : ""}
                ${pose.difficulty === "Intermediate" ? "border-brass-dim text-brass" : ""}
                ${pose.difficulty === "Advanced" ? "border-[#8a4c46] text-[#d97e6f]" : ""}`}
              >
                {pose.difficulty}
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-bone-dim text-sm py-5">
            No poses in this category.
          </div>
        )}
      </div>
    </>
  );
}

/* ==================== NUTRITION VIEW ==================== */
function NutritionView({
  nutritionState,
  updateNutrition,
}: {
  nutritionState: NutritionState;
  updateNutrition: (fn: (prev: NutritionState) => NutritionState) => void;
}) {
  const [nutView, setNutView] = useState<"dashboard" | "foods" | "meals">("dashboard");

  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = nutritionState.mealLogs.filter((m) => m.date === today);

  const totals = todayLogs.reduce(
    (acc, log) => {
      log.foodIds.forEach((fid) => {
        const food = nutritionState.foods.find((f) => f.id === fid);
        if (food) {
          acc.kcal += food.kcal;
          acc.protein += food.protein;
          acc.carbs += food.carbs;
          acc.fat += food.fat;
        }
      });
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const goals = nutritionState.nutritionGoals;
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

  const MacroBar = ({
    label,
    current,
    target,
    color,
  }: {
    label: string;
    current: number;
    target: number;
    color: string;
  }) => {
    const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    return (
      <div className="mb-3">
        <div className="flex justify-between text-xs text-bone-dim mb-1">
          <span className="uppercase tracking-[0.05em]">{label}</span>
          <span className="font-['IBM_Plex_Mono']">
            {Math.round(current)} / {target}
          </span>
        </div>
        <div className="h-2 bg-bg rounded-full overflow-hidden border border-line">
          <div
            className="h-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[30px] font-['Oswald'] uppercase tracking-wider text-bone">
          Nutrition
        </h1>
        <div className="text-sm text-bone-dim mt-1.5">
          Track macros, browse foods, and plan your meals.
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "foods", label: "Food Library" },
          { id: "meals", label: "Meal Planner" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setNutView(tab.id as typeof nutView)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${nutView === tab.id ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {nutView === "dashboard" && (
        <>
          <div className="bg-surface border border-line rounded-[10px] p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-brass uppercase tracking-[0.05em]">Today's Macros</h3>
              <button
                onClick={() => {
                  const goalsNew = prompt(
                    "Enter new targets as: kcal,protein,g,carbs,fat",
                    `${goals.kcal},${goals.protein},${goals.carbs},${goals.fat}`,
                  );
                  if (goalsNew) {
                    const parts = goalsNew.split(",").map(Number);
                    if (parts.length === 4) {
                      updateNutrition((s) => ({
                        ...s,
                        nutritionGoals: {
                          kcal: parts[0],
                          protein: parts[1],
                          carbs: parts[2],
                          fat: parts[3],
                        },
                      }));
                    }
                  }
                }}
                className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass"
              >
                Edit Targets
              </button>
            </div>
            <MacroBar label="Calories" current={totals.kcal} target={goals.kcal} color="#c68a3e" />
            <MacroBar
              label="Protein"
              current={totals.protein}
              target={goals.protein}
              color="#7ea366"
            />
            <MacroBar label="Carbs" current={totals.carbs} target={goals.carbs} color="#8fa0c9" />
            <MacroBar label="Fat" current={totals.fat} target={goals.fat} color="#d97e6f" />
          </div>

          {mealTypes.map((mt) => {
            const mealLog = todayLogs.find((l) => l.mealType === mt);
            const mealFoods = mealLog
              ? (mealLog.foodIds
                  .map((fid) => nutritionState.foods.find((f) => f.id === fid))
                  .filter(Boolean) as FoodItem[])
              : [];
            return (
              <div key={mt} className="bg-surface border border-line rounded-[10px] p-5 mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm text-brass uppercase tracking-[0.05em]">{mt}</h3>
                  <button
                    onClick={() => {
                      const allFoods = nutritionState.foods;
                      const items = allFoods
                        .map((f) => `${f.id}: ${f.name} (${f.kcal}kcal, ${f.protein}g protein)`)
                        .join("\n");
                      const input = prompt(`Enter food IDs to add (comma-separated):\n\n${items}`);
                      if (input) {
                        const ids = input
                          .split(",")
                          .map((x) => x.trim())
                          .filter((x) => allFoods.find((f) => f.id === x));
                        if (ids.length > 0) {
                          updateNutrition((s) => {
                            const existing = s.mealLogs.filter(
                              (m) => !(m.date === today && m.mealType === mt),
                            );
                            return {
                              ...s,
                              mealLogs: [
                                ...existing,
                                { id: uid(), date: today, mealType: mt, foodIds: ids },
                              ],
                            };
                          });
                        }
                      }
                    }}
                    className="text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass"
                  >
                    <Plus className="w-3 h-3 inline mr-0.5" /> Add
                  </button>
                </div>
                {mealFoods.length > 0 ? (
                  <div className="space-y-1">
                    {mealFoods.map((f, i) => (
                      <div key={i} className="flex justify-between text-sm text-bone-dim">
                        <span>{f.name}</span>
                        <span className="font-['IBM_Plex_Mono'] text-xs">{f.kcal}kcal</span>
                      </div>
                    ))}
                    <div className="border-t border-line pt-1 mt-1 flex justify-between text-sm text-bone font-['IBM_Plex_Mono']">
                      <span>Total</span>
                      <span>{Math.round(mealFoods.reduce((a, f) => a + f.kcal, 0))}kcal</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-bone-dim">No foods logged.</div>
                )}
              </div>
            );
          })}
        </>
      )}

      {nutView === "foods" && <FoodLibraryView foods={nutritionState.foods} />}

      {nutView === "meals" && (
        <MealPlannerView
          mealSuggestions={nutritionState.mealSuggestions}
          foods={nutritionState.foods}
          nutritionState={nutritionState}
          updateNutrition={updateNutrition}
        />
      )}
    </>
  );
}

function FoodLibraryView({ foods }: { foods: FoodItem[] }) {
  const [foodFilter, setFoodFilter] = useState("all");
  const cats = ["all", "protein", "legumes", "grains", "vegetables", "fruits", "nuts", "dairy"];

  const filtered = foodFilter === "all" ? foods : foods.filter((f) => f.category === foodFilter);

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFoodFilter(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${foodFilter === c ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center gap-3 py-3.5 border-b border-line last:border-b-0"
          >
            <div className="min-w-0">
              <div className="font-semibold text-sm text-bone">
                {f.name}
                {f.plantBased && <span className="text-[10px] text-moss ml-2">&#x1f331;</span>}
              </div>
              <div className="text-xs text-bone-dim mt-0.5">{f.servingSize}</div>
            </div>
            <div className="flex gap-3 text-xs font-['IBM_Plex_Mono'] text-bone-dim shrink-0">
              <span>{f.kcal}kcal</span>
              <span className="text-moss">{f.protein}g</span>
              <span>{f.carbs}g</span>
              <span>{f.fat}g</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-bone-dim text-sm py-5">No foods in this category.</div>
        )}
      </div>
    </>
  );
}

function MealPlannerView({
  mealSuggestions,
  foods,
  nutritionState,
  updateNutrition,
}: {
  mealSuggestions: MealSuggestion[];
  foods: FoodItem[];
  nutritionState: NutritionState;
  updateNutrition: (fn: (prev: NutritionState) => NutritionState) => void;
}) {
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10));

  const dayMeals = nutritionState.mealLogs.filter((m) => m.date === selectedDay);
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

  const dayTotals = dayMeals.reduce(
    (acc, log) => {
      log.foodIds.forEach((fid) => {
        const food = foods.find((f) => f.id === fid);
        if (food) {
          acc.kcal += food.kcal;
          acc.protein += food.protein;
          acc.carbs += food.carbs;
          acc.fat += food.fat;
        }
      });
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <>
      <div className="mb-4">
        <h3 className="text-sm text-brass uppercase tracking-[0.05em] mb-2">Meal Suggestions</h3>
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3">
          {mealSuggestions.map((m) => (
            <div key={m.id} className="bg-surface border border-line rounded-[10px] p-3.5">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-bone">{m.name}</div>
                  <div className="text-xs text-bone-dim mt-0.5">{m.ingredients.join(", ")}</div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border shrink-0 ml-2
                  ${m.plantBased ? "border-moss-dim text-moss" : "border-line text-bone-dim"}`}
                >
                  {m.plantBased ? "Plant" : "Standard"}
                </span>
              </div>
              <div className="flex gap-3 mt-2 text-xs font-['IBM_Plex_Mono'] text-bone-dim">
                <span>{m.kcal}kcal</span>
                <span className="text-moss">{m.protein}g</span>
                <span>{m.carbs}g</span>
                <span>{m.fat}g</span>
              </div>
              <button
                onClick={() => {
                  const foodIds = m.ingredients
                    .map((ing) =>
                      foods.find((f) =>
                        f.name.toLowerCase().includes(ing.split(" ")[0].toLowerCase()),
                      ),
                    )
                    .filter(Boolean)
                    .map((f) => f!.id);
                  if (foodIds.length > 0) {
                    updateNutrition((s) => {
                      const existing = s.mealLogs.filter(
                        (ml) => !(ml.date === selectedDay && ml.mealType === m.mealType),
                      );
                      return {
                        ...s,
                        mealLogs: [
                          ...existing,
                          { id: uid(), date: selectedDay, mealType: m.mealType, foodIds },
                        ],
                      };
                    });
                  }
                }}
                className="mt-2 text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass"
              >
                <Plus className="w-3 h-3 inline mr-0.5" /> Add to {selectedDay}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-line rounded-[10px] p-5">
        <h3 className="text-sm text-brass uppercase tracking-[0.05em] mb-3">Weekly Overview</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-md text-xs uppercase tracking-[0.04em] border
                ${d === selectedDay ? "border-brass text-brass bg-brass/10" : "border-line text-bone-dim"}`}
            >
              {new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}
              <div className="font-['IBM_Plex_Mono'] text-[10px] opacity-70">{d.slice(5)}</div>
            </button>
          ))}
        </div>

        {mealTypes.map((mt) => {
          const log = dayMeals.find((m) => m.mealType === mt);
          const mealFoods = log
            ? (log.foodIds
                .map((fid) => foods.find((f) => f.id === fid))
                .filter(Boolean) as FoodItem[])
            : [];
          return (
            <div
              key={mt}
              className="flex items-center gap-3 py-2.5 border-b border-line last:border-b-0"
            >
              <div className="w-20 shrink-0">
                <span className="text-[11px] uppercase tracking-[0.05em] text-brass">{mt}</span>
              </div>
              <div className="flex-1">
                {mealFoods.length > 0 ? (
                  <div className="text-sm text-bone-dim">
                    {mealFoods.map((f) => f.name).join(", ")}
                  </div>
                ) : (
                  <div className="text-sm text-bone-dim opacity-50">Not planned</div>
                )}
              </div>
              <div className="text-xs font-['IBM_Plex_Mono'] text-bone-dim shrink-0">
                {Math.round(mealFoods.reduce((a, f) => a + f.kcal, 0))}kcal
              </div>
            </div>
          );
        })}

        <div className="flex justify-between items-center pt-3 mt-1 border-t border-line">
          <span className="text-xs uppercase tracking-[0.05em] text-bone">Daily Total</span>
          <span className="text-sm font-['IBM_Plex_Mono'] text-brass">
            {Math.round(dayTotals.kcal)}kcal &middot; {Math.round(dayTotals.protein)}g P &middot;{" "}
            {Math.round(dayTotals.carbs)}g C &middot; {Math.round(dayTotals.fat)}g F
          </span>
        </div>
      </div>
    </>
  );
}

/* ==================== ROOT APP ==================== */
export default function App() {
  return (
    <AuthProvider>
      <WorkoutApp />
    </AuthProvider>
  );
}
