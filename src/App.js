import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import { Dumbbell, Calendar, Library, TrendingUp, BookOpen, Sun, Apple, LogOut, Plus, X, Check, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle, } from "lucide-react";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { useLocalStorage } from "./lib/store";
import { seedState, uid, SHAPES, POSES, } from "./lib/workout-data";
import { seedNutritionState, } from "./lib/nutrition-data";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
function WorkoutApp() {
    const { user, signOut } = useAuth();
    const [view, setView] = useState("today");
    const [modalContent, setModalContent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [state, setState] = useLocalStorage(`fieldnotes_state_${user?.id || "anon"}`, seedState());
    const [nutritionState, setNutritionState] = useLocalStorage(`fieldnotes_nutrition_${user?.id || "anon"}`, seedNutritionState());
    const [authForm, setAuthForm] = useState("login");
    const openModal = (content) => {
        setModalContent(content);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };
    const updateState = (fn) => {
        setState(fn);
    };
    const updateNutrition = (fn) => {
        setNutritionState(fn);
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen bg-bg flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-sm", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "text-2xl font-['Oswald'] uppercase tracking-wider text-bone", children: "FieldNotes" }), _jsx("div", { className: "text-xs uppercase tracking-[0.08em] text-bone-dim mt-1", children: "Training Log" })] }), authForm === "login" ? (_jsx(LoginPage, { onSwitch: () => setAuthForm("signup") })) : (_jsx(SignupPage, { onSwitch: () => setAuthForm("login") }))] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-bg flex flex-col lg:flex-row", children: [_jsxs("div", { className: "lg:w-[220px] bg-surface border-b lg:border-b-0 lg:border-r border-line flex lg:flex-col shrink-0 overflow-x-auto", children: [_jsxs("div", { className: "hidden lg:block px-5 pb-5 border-b border-line mb-4", children: [_jsx("div", { className: "text-[22px] font-['Oswald'] uppercase tracking-wider text-bone leading-tight", children: "FieldNotes" }), _jsx("div", { className: "text-[11px] uppercase tracking-[0.08em] text-bone-dim mt-1", children: "Training Log" })] }), [
                        { id: "today", label: "Today", icon: Calendar },
                        { id: "programs", label: "Programs", icon: Dumbbell },
                        { id: "library", label: "Library", icon: Library },
                        { id: "progress", label: "Progress", icon: TrendingUp },
                        { id: "knowledge", label: "Knowledge", icon: BookOpen },
                        { id: "yoga", label: "Yoga", icon: Sun },
                        { id: "nutrition", label: "Nutrition", icon: Apple },
                    ].map((tab) => (_jsxs("button", { onClick: () => setView(tab.id), className: `flex items-center gap-3 px-5 py-3 text-[13px] uppercase tracking-[0.05em] font-medium transition-colors
              border-l-3 lg:border-l-3 lg:border-b-0 border-b-3
              ${view === tab.id
                            ? "text-bone bg-surface-2 border-brass"
                            : "text-bone-dim border-transparent hover:text-bone hover:bg-white/[0.02]"}`, children: [_jsx(tab.icon, { className: "w-4 h-4" }), _jsx("span", { className: "lg:inline", children: tab.label })] }, tab.id))), _jsx("div", { className: "flex-1" }), _jsxs("button", { onClick: signOut, className: "flex items-center gap-3 px-5 py-3 text-[13px] uppercase tracking-[0.05em] text-bone-dim hover:text-bone border-l-3 border-transparent", children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { className: "hidden lg:inline", children: "Sign Out" })] })] }), _jsxs("div", { className: "flex-1 p-6 lg:p-9 max-w-[1100px] overflow-y-auto", children: [view === "today" && (_jsx(TodayView, { state: state, updateState: updateState, openModal: openModal, closeModal: closeModal })), view === "programs" && (_jsx(ProgramsView, { state: state, updateState: updateState, openModal: openModal, closeModal: closeModal })), view === "library" && (_jsx(LibraryView, { state: state, updateState: updateState, openModal: openModal, closeModal: closeModal })), view === "progress" && (_jsx(ProgressView, { state: state, updateState: updateState, openModal: openModal, closeModal: closeModal })), view === "knowledge" && (_jsx(KnowledgeView, { state: state, updateState: updateState, openModal: openModal, closeModal: closeModal })), view === "yoga" && (_jsx(YogaView, { openModal: openModal, closeModal: closeModal })), view === "nutrition" && (_jsx(NutritionView, { nutritionState: nutritionState, updateNutrition: updateNutrition }))] }), modalOpen && (_jsx("div", { className: "fixed inset-0 bg-[rgba(10,12,10,0.7)] z-50 flex items-center justify-center", onClick: (e) => { if (e.target === e.currentTarget)
                    closeModal(); }, children: _jsx("div", { className: "bg-surface border border-line rounded-[10px] p-6 w-[420px] max-w-[92vw] max-h-[85vh] overflow-y-auto", children: modalContent }) }))] }));
}
/* ==================== TODAY VIEW ==================== */
function TodayView({ state, updateState, openModal: _openModal, closeModal: _closeModal, }) {
    const prog = state.programs.find((p) => p.id === state.activeProgramId);
    const today = new Date().toISOString().slice(0, 10);
    const strip = (_jsx("div", { className: "flex gap-2 flex-wrap mb-5", children: prog?.days.map((d, i) => (_jsx("button", { onClick: () => updateState((s) => ({ ...s, activeDayIndex: i })), className: `px-3.5 py-2 rounded-md border text-xs uppercase tracking-[0.04em]
            ${i === state.activeDayIndex
                ? "border-brass text-brass bg-brass/10"
                : "border-line text-bone-dim"}`, children: d.label }, i))) }));
    const day = prog?.days[state.activeDayIndex];
    const checkKey = `${prog?.id}_${state.activeDayIndex}_${today}`;
    const checks = state.checks[checkKey] || {};
    const toggleCheck = (idx) => {
        const newChecks = { ...state.checks };
        if (!newChecks[checkKey])
            newChecks[checkKey] = {};
        newChecks[checkKey][idx] = !newChecks[checkKey][idx];
        updateState((s) => ({ ...s, checks: newChecks }));
    };
    const logSession = () => {
        if (!prog || !day)
            return;
        updateState((s) => ({
            ...s,
            logs: [...s.logs, { date: today, programId: prog.id, dayLabel: day.label, focus: day.focus, exCount: day.exercises.length }],
        }));
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "page-head", children: _jsxs("div", { children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: prog ? prog.name : "Today" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5 max-w-[520px]", children: prog ? prog.desc : "Pick an active program to see your workout for today." })] }) }), prog && strip, _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5", children: [!prog && (_jsxs("div", { className: "text-center text-bone-dim text-sm py-5", children: ["No active program yet. Go to ", _jsx("b", { children: "Programs" }), " to start one."] })), prog && (!day || day.exercises.length === 0) && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-brass text-sm uppercase tracking-[0.05em] mb-2", children: day?.focus || "Rest Day" }), _jsx("div", { className: "text-bone-dim text-sm py-3", children: "Rest day. Recovery is part of the plan." })] })), prog && day && day.exercises.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-brass text-sm uppercase tracking-[0.05em] mb-4", children: day.focus }), day.exercises.map((pe, i) => {
                                const ex = state.exercises.find((e) => e.id === pe.exId);
                                if (!ex)
                                    return null;
                                const checked = checks[i];
                                return (_jsxs("div", { className: "flex items-center gap-3.5 py-3.5 border-b border-line last:border-b-0", children: [_jsx("button", { onClick: () => toggleCheck(i), className: `w-[22px] h-[22px] rounded-[5px] border-2 flex items-center justify-center shrink-0 text-sm
                      ${checked ? "bg-moss border-moss text-[#0e150f]" : "border-line text-transparent"}`, children: checked && _jsx(Check, { className: "w-3.5 h-3.5" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-semibold text-sm text-bone", children: ex.name }), _jsxs("div", { className: "text-xs text-bone-dim mt-0.5", children: [ex.muscle, " \u00B7 ", pe.sets, " sets \u00D7 ", pe.reps, ex.note && _jsxs("span", { children: [" \u00B7 ", ex.note] })] })] })] }, i));
                            }), _jsxs("button", { onClick: logSession, className: "mt-4 bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: [_jsx(CheckCircle, { className: "w-4 h-4 inline mr-1.5" }), "Log Session Complete"] })] }))] }), _jsx(TimerCard, {})] }));
}
/* ==================== TIMER ==================== */
function TimerCard() {
    const [work, setWork] = useState(40);
    const [rest, setRest] = useState(20);
    const [rounds, setRounds] = useState(5);
    const [phase, setPhase] = useState("idle");
    const [round, setRound] = useState(1);
    const [remaining, setRemaining] = useState(40);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const beep = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        }
        catch { /* ignore */ }
    };
    const start = () => {
        if (running)
            return;
        if (remaining <= 0 || phase === "idle") {
            setPhase("work");
            setRound(1);
            setRemaining(work);
        }
        setRunning(true);
    };
    useEffect(() => {
        if (!running) {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev > 1)
                    return prev - 1;
                beep();
                if (phase === "work") {
                    setPhase("rest");
                    return rest;
                }
                else {
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
        return () => { if (intervalRef.current)
            clearInterval(intervalRef.current); };
    }, [running, phase, round, work, rest, rounds]);
    const pause = () => {
        setRunning(false);
    };
    const reset = () => {
        setRunning(false);
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        setRound(1);
        setPhase("work");
        setRemaining(work);
    };
    return (_jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5 mt-4", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.15em] text-bone-dim text-center mb-1", children: "Interval Timer" }), _jsxs("div", { className: "flex justify-center gap-4 mb-2", children: [_jsxs("div", { className: "w-[90px]", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Work (s)" }), _jsx("input", { type: "number", value: work, onChange: (e) => setWork(Number(e.target.value)), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm text-center" })] }), _jsxs("div", { className: "w-[90px]", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Rest (s)" }), _jsx("input", { type: "number", value: rest, onChange: (e) => setRest(Number(e.target.value)), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm text-center" })] }), _jsxs("div", { className: "w-[90px]", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Rounds" }), _jsx("input", { type: "number", value: rounds, onChange: (e) => setRounds(Number(e.target.value)), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm text-center" })] })] }), _jsx("div", { className: "text-xs uppercase tracking-[0.15em] text-bone-dim text-center mb-1", children: phase === "idle" ? "Ready" : `${phase === "work" ? "Work" : "Rest"} — Round ${round}/${rounds}` }), _jsx("div", { className: `font-['IBM_Plex_Mono'] text-5xl lg:text-6xl font-semibold text-center py-4 tracking-[0.02em]
        ${phase === "rest" ? "text-moss" : "text-brass"}`, children: fmt(remaining) }), _jsxs("div", { className: "flex gap-2.5 justify-center mt-3.5", children: [_jsxs("button", { onClick: start, className: "bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: [_jsx(Play, { className: "w-3.5 h-3.5 inline mr-1" }), " Start"] }), _jsxs("button", { onClick: pause, className: "bg-transparent text-bone border border-line px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:border-brass hover:text-brass", children: [_jsx(Pause, { className: "w-3.5 h-3.5 inline mr-1" }), " Pause"] }), _jsxs("button", { onClick: reset, className: "bg-transparent text-bone border border-line px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:border-brass hover:text-brass", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5 inline mr-1" }), " Reset"] })] })] }));
}
/* ==================== PROGRAMS VIEW ==================== */
function ProgramsView({ state, updateState, openModal, closeModal, }) {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between items-end flex-wrap gap-3 mb-7", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Programs" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5 max-w-[520px]", children: "Build a routine day by day, or use the pre-loaded 7-Day Recomposition Plan." })] }), _jsxs("button", { onClick: () => {
                            openModal(_jsx(NewProgramForm, { onSave: (name, desc) => {
                                    updateState((s) => ({
                                        ...s,
                                        programs: [...s.programs, { id: uid(), name, desc, days: [] }],
                                    }));
                                    closeModal();
                                } }));
                        }, className: "bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: [_jsx(Plus, { className: "w-4 h-4 inline mr-1" }), " New Program"] })] }), _jsx("div", { className: "space-y-3.5", children: state.programs.map((p) => (_jsxs("div", { className: `bg-surface border rounded-[10px] p-5 cursor-pointer transition-colors hover:border-brass-dim
              ${p.id === state.activeProgramId ? "border-brass" : "border-line"}`, children: [_jsxs("div", { className: "flex justify-between items-start gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h2", { className: "text-lg text-bone font-['Oswald']", children: p.name }), _jsx("div", { className: "text-sm text-bone-dim mt-1 max-w-[500px]", children: p.desc })] }), _jsxs("div", { className: "flex gap-2 shrink-0", children: [p.id === state.activeProgramId ? (_jsx("span", { className: "text-[10px] uppercase tracking-[0.05em] px-2 py-1 rounded-full border border-brass text-brass", children: "Active" })) : (_jsx("button", { onClick: (e) => { e.stopPropagation(); updateState((s) => ({ ...s, activeProgramId: p.id, activeDayIndex: 0 })); }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-3 py-1.5 rounded-md hover:border-brass hover:text-brass", children: "Set Active" })), _jsxs("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                openModal(_jsx(AddDayForm, { program: p, exercises: state.exercises, onSave: (label, focus, exercises) => {
                                                        updateState((s) => ({
                                                            ...s,
                                                            programs: s.programs.map((prog) => prog.id === p.id
                                                                ? { ...prog, days: [...prog.days, { label, focus, exercises }] }
                                                                : prog),
                                                        }));
                                                        closeModal();
                                                    } }));
                                            }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-3 py-1.5 rounded-md hover:border-brass hover:text-brass", children: [_jsx(Plus, { className: "w-3 h-3 inline mr-0.5" }), " Day"] }), _jsxs("button", { onClick: (e) => {
                                                e.stopPropagation();
                                                if (!confirm("Delete this program?"))
                                                    return;
                                                updateState((s) => {
                                                    const filtered = s.programs.filter((prog) => prog.id !== p.id);
                                                    return {
                                                        ...s,
                                                        programs: filtered,
                                                        activeProgramId: s.activeProgramId === p.id ? (filtered[0]?.id || null) : s.activeProgramId,
                                                    };
                                                });
                                            }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-danger border border-danger px-3 py-1.5 rounded-md hover:opacity-80", children: [_jsx(X, { className: "w-3 h-3 inline mr-0.5" }), " Delete"] })] })] }), _jsx("div", { className: "mt-3.5 space-y-2.5", children: p.days.map((d, i) => (_jsxs("div", { className: "border border-line rounded-lg p-3.5", children: [_jsxs("h3", { className: "text-sm text-brass mb-2", children: [d.label, " \u2014 ", d.focus] }), _jsx("div", { className: "text-sm text-bone-dim space-y-1", children: d.exercises.length > 0
                                            ? d.exercises.map((pe, j) => {
                                                const ex = state.exercises.find((e) => e.id === pe.exId);
                                                return ex ? _jsxs("div", { children: [ex.name, " \u2014 ", pe.sets, "\u00D7", pe.reps] }, j) : null;
                                            })
                                            : _jsx("div", { children: "Rest" }) })] }, i))) })] }, p.id))) })] }));
}
function NewProgramForm({ onSave }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    return (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-['Oswald'] text-bone mb-4", children: "New Program" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Program Name" }), _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. My Custom Split", className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Description" }), _jsx("textarea", { value: desc, onChange: (e) => setDesc(e.target.value), rows: 2, placeholder: "What is this program for?", className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsx("button", { onClick: () => { if (!name.trim())
                    return; onSave(name.trim(), desc.trim()); }, className: "bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: "Create" })] }));
}
function AddDayForm({ program, exercises, onSave, }) {
    const [label, setLabel] = useState(`Day ${program.days.length + 1}`);
    const [focus, setFocus] = useState("");
    const [selected, setSelected] = useState([]);
    const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    return (_jsxs(_Fragment, { children: [_jsxs("h2", { className: "text-lg font-['Oswald'] text-bone mb-4", children: ["Add Day to ", program.name] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Day Label" }), _jsx("input", { value: label, onChange: (e) => setLabel(e.target.value), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Focus" }), _jsx("input", { value: focus, onChange: (e) => setFocus(e.target.value), placeholder: "e.g. Lower Body Strength", className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Exercises" }), _jsx("div", { className: "max-h-48 overflow-y-auto space-y-1", children: exercises.map((ex) => (_jsxs("label", { className: "flex items-center gap-2 text-sm text-bone-dim cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: selected.includes(ex.id), onChange: () => toggle(ex.id), className: "accent-brass" }), ex.name] }, ex.id))) }), _jsx("div", { className: "text-[11px] text-bone-dim mt-1", children: "Leave empty for a rest day." })] }), _jsx("button", { onClick: () => {
                    const dayExercises = selected.map((id) => {
                        const e = exercises.find((x) => x.id === id);
                        return { exId: id, sets: e?.sets || 3, reps: e?.reps || 10 };
                    });
                    onSave(label.trim() || `Day ${program.days.length + 1}`, focus.trim() || "Rest", dayExercises);
                }, className: "bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: "Add Day" })] }));
}
/* ==================== LIBRARY VIEW ==================== */
function LibraryView({ state, updateState, openModal, closeModal, }) {
    const [filter, setFilter] = useState("all");
    const filtered = filter === "all"
        ? state.exercises
        : state.exercises.filter((e) => e.cat === filter);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between items-end flex-wrap gap-3 mb-7", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Library" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5 max-w-[520px]", children: "Every exercise available to add into a program." })] }), _jsxs("button", { onClick: () => {
                            openModal(_jsx(NewExerciseForm, { onSave: (ex) => {
                                    updateState((s) => ({ ...s, exercises: [...s.exercises, ex] }));
                                    closeModal();
                                } }));
                        }, className: "bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: [_jsx(Plus, { className: "w-4 h-4 inline mr-1" }), " Add Exercise"] })] }), _jsx("div", { className: "flex gap-2 mb-4 flex-wrap", children: ["all", "strength", "cardio", "mobility"].map((c) => (_jsx("button", { onClick: () => setFilter(c), className: `px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${filter === c ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`, children: c }, c))) }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5", children: [filtered.map((ex) => (_jsxs("div", { className: "flex justify-between items-center gap-3 py-3.5 border-b border-line last:border-b-0", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "font-semibold text-sm text-bone", children: [ex.name, _jsx("span", { className: `text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border ml-2
                  ${ex.cat === "strength" ? "border-brass-dim text-brass" : ""}
                  ${ex.cat === "cardio" ? "border-[#8a4c46] text-[#d97e6f]" : ""}
                  ${ex.cat === "mobility" ? "border-moss-dim text-moss" : ""}`, children: ex.cat })] }), _jsxs("div", { className: "text-xs text-bone-dim mt-0.5", children: [ex.muscle, " \u00B7 default ", ex.sets, "\u00D7", ex.reps, ex.note && _jsxs("span", { children: [" \u00B7 ", ex.note] })] })] }), _jsx("button", { onClick: () => {
                                    if (!confirm("Remove this exercise?"))
                                        return;
                                    updateState((s) => ({ ...s, exercises: s.exercises.filter((e) => e.id !== ex.id) }));
                                }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-danger border border-danger px-2.5 py-1 rounded-md hover:opacity-80 shrink-0", children: _jsx(X, { className: "w-3 h-3" }) })] }, ex.id))), filtered.length === 0 && (_jsx("div", { className: "text-center text-bone-dim text-sm py-5", children: "No exercises in this category." }))] })] }));
}
function NewExerciseForm({ onSave }) {
    const [name, setName] = useState("");
    const [cat, setCat] = useState("strength");
    const [muscle, setMuscle] = useState("");
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState(12);
    const [note, setNote] = useState("");
    return (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-['Oswald'] text-bone mb-4", children: "Add Exercise" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Name" }), _jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Category" }), _jsxs("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm", children: [_jsx("option", { value: "strength", children: "Strength" }), _jsx("option", { value: "cardio", children: "Cardio" }), _jsx("option", { value: "mobility", children: "Mobility" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Muscle / Focus" }), _jsx("input", { value: muscle, onChange: (e) => setMuscle(e.target.value), placeholder: "e.g. Legs", className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Default Sets" }), _jsx("input", { type: "number", value: sets, onChange: (e) => setSets(Number(e.target.value)), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Default Reps" }), _jsx("input", { type: "number", value: reps, onChange: (e) => setReps(Number(e.target.value)), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Note (optional)" }), _jsx("input", { value: note, onChange: (e) => setNote(e.target.value), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsx("button", { onClick: () => {
                    if (!name.trim())
                        return;
                    onSave({
                        id: uid(), name: name.trim(), cat,
                        muscle: muscle.trim() || "General",
                        sets, reps, note: note.trim() || undefined,
                    });
                }, className: "bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: "Add to Library" })] }));
}
function ProgressView({ state, updateState, openModal, closeModal, }) {
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
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-7", children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Progress" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5", children: "Goals, streaks, and your session history." })] }), _jsx("div", { className: "grid grid-cols-3 max-lg:grid-cols-1 gap-4 mb-4", children: [
                    { num: streak, label: "Day Streak" },
                    { num: total, label: "Sessions Logged" },
                    { num: weekCount, label: "This Week" },
                ].map((s, i) => (_jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-4 text-center", children: [_jsx("div", { className: "font-['IBM_Plex_Mono'] text-3xl text-brass", children: s.num }), _jsx("div", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim mt-1", children: s.label })] }, i))) }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5 mb-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em]", children: "Goal" }), _jsx("button", { onClick: () => {
                                    openModal(_jsx(EditGoalForm, { goal: g, onSave: (goal) => { updateState((s) => ({ ...s, goal })); closeModal(); } }));
                                }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2.5 py-1 rounded-md hover:border-brass hover:text-brass", children: "Edit" })] }), _jsxs("div", { className: "mt-2.5", children: [_jsxs("div", { className: "text-sm text-bone-dim mb-2", children: [g.targetWeight && _jsxs(_Fragment, { children: ["Target weight: ", _jsxs("b", { className: "text-bone", children: [g.targetWeight, "kg"] }), " \u00B7 "] }), "Weekly target: ", _jsxs("b", { className: "text-bone", children: [g.weeklyTarget, " sessions"] }), g.notes && _jsx("div", { className: "mt-1.5", children: g.notes })] }), _jsx("div", { className: "h-2 bg-bg rounded-full overflow-hidden border border-line", children: _jsx("div", { className: "h-full bg-gradient-to-r from-brass-dim to-brass transition-all", style: { width: `${pct}%` } }) }), _jsxs("div", { className: "text-[11px] text-bone-dim mt-1", children: [weekCount, "/", g.weeklyTarget, " sessions this week"] })] })] }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em] mb-3", children: "History" }), logs.length === 0 ? (_jsx("div", { className: "text-center text-bone-dim text-sm py-5", children: "No sessions logged yet." })) : (_jsx("div", { children: logs.slice().reverse().slice(0, 30).map((l, i) => (_jsx("div", { className: "flex items-center gap-3.5 py-3.5 border-b border-line last:border-b-0", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "font-semibold text-sm text-bone", children: [l.dayLabel, " \u2014 ", l.focus] }), _jsxs("div", { className: "text-xs text-bone-dim mt-0.5", children: [l.date, " \u00B7 ", l.exCount, " exercises"] })] }) }, i))) }))] })] }));
}
function EditGoalForm({ goal, onSave }) {
    const [targetWeight, setTargetWeight] = useState(goal.targetWeight);
    const [weeklyTarget, setWeeklyTarget] = useState(goal.weeklyTarget);
    const [notes, setNotes] = useState(goal.notes);
    return (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-['Oswald'] text-bone mb-4", children: "Edit Goal" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Target Weight (kg, optional)" }), _jsx("input", { type: "number", value: targetWeight, onChange: (e) => setTargetWeight(e.target.value), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Weekly Session Target" }), _jsx("input", { type: "number", value: weeklyTarget, onChange: (e) => setWeeklyTarget(Number(e.target.value)), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Notes" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsx("button", { onClick: () => onSave({ targetWeight, weeklyTarget, notes, startDate: goal.startDate }), className: "bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: "Save Goal" })] }));
}
function KnowledgeView({ state, updateState, openModal, closeModal, }) {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-7", children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Knowledge" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5", children: "Reference notes \u2014 why the plan is built this way." })] }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5 space-y-4 mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm text-brass mb-2", children: "Recomposition, not one-then-the-other" }), _jsx("p", { className: "text-sm text-bone-dim leading-relaxed", children: "You don't need to build muscle first and lose fat later. Training for strength while eating in a modest calorie deficit lets a beginner lose fat and build muscle at the same time \u2014 the response to new training stimulus is fastest in the first few months." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm text-brass mb-2", children: "Strength before pure cardio" }), _jsx("p", { className: "text-sm text-bone-dim leading-relaxed", children: "HIIT burns calories short-term. Strength training builds the muscle that raises resting metabolism long-term and shapes the body. Starting split: 4 strength days, 1\u20132 light cardio/HIIT days, rest days built in." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm text-brass mb-2", children: "Protein & calories matter more than the workout" }), _jsx("p", { className: "text-sm text-bone-dim leading-relaxed", children: "Fat loss needs a calorie deficit; muscle building needs enough protein \u2014 roughly 1.2\u20131.6g per kg of bodyweight is a common target \u2014 plus enough total food to fuel the sessions. Moderate deficit, adequate protein, is the combination that lets both happen together." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm text-brass mb-2", children: "Choosing a starting dumbbell weight" }), _jsx("p", { className: "text-sm text-bone-dim leading-relaxed", children: "The right weight is one where the last 2\u20133 reps of a set feel hard but form stays clean. Breezing through with no fatigue: go up. Form breaking down before the set ends: go lighter. Starting points for a smaller frame \u2014 goblet squats 4\u20136kg, rows 3\u20134kg, shoulder press 2\u20133kg, curls 2\u20133kg per hand." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm text-brass mb-2", children: "Progression rule" }), _jsx("p", { className: "text-sm text-bone-dim leading-relaxed", children: "When a rep range feels easy for two sessions in a row, add weight or reps. Consistency across 8\u201312 weeks matters more than intensity in week one." })] })] }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5", children: [_jsxs("div", { className: "flex justify-between items-center mb-2.5", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em]", children: "My Notes" }), _jsxs("button", { onClick: () => {
                                    openModal(_jsx(AddNoteForm, { onSave: (note) => {
                                            updateState((s) => ({ ...s, myNotes: [...s.myNotes, note] }));
                                            closeModal();
                                        } }));
                                }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2.5 py-1 rounded-md hover:border-brass hover:text-brass", children: [_jsx(Plus, { className: "w-3 h-3 inline mr-0.5" }), " Add Note"] })] }), state.myNotes.length === 0 ? (_jsx("div", { className: "text-center text-bone-dim text-sm py-5", children: "No personal notes yet." })) : (_jsx("div", { className: "space-y-3", children: state.myNotes.map((n, i) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-sm text-brass", children: n.title || "Note" }), _jsx("button", { onClick: () => updateState((s) => ({ ...s, myNotes: s.myNotes.filter((_, j) => j !== i) })), className: "text-[11px] text-danger hover:opacity-80", children: _jsx(X, { className: "w-3 h-3" }) })] }), _jsx("p", { className: "text-sm text-bone-dim mt-1", children: n.body })] }, i))) }))] })] }));
}
function AddNoteForm({ onSave }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    return (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-['Oswald'] text-bone mb-4", children: "Add Note" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Title" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Note" }), _jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), rows: 4, className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsx("button", { onClick: () => { if (!body.trim())
                    return; onSave({ title: title.trim(), body: body.trim() }); }, className: "bg-brass text-[#1a1408] border-none px-4 py-2 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: "Save Note" })] }));
}
/* ==================== YOGA VIEW ==================== */
function YogaView({ openModal, closeModal: _closeModal, }) {
    const [filter, setFilter] = useState("all");
    const [inSequence, setInSequence] = useState(false);
    const [seqIndex, setSeqIndex] = useState(0);
    const [seqRemaining, setSeqRemaining] = useState(0);
    const [seqRunning, setSeqRunning] = useState(false);
    const [voiceCoach, setVoiceCoach] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const seqIntervalRef = useRef(null);
    const sequence = POSES.filter((p) => p.seq).sort((a, b) => (a.seq || 0) - (b.seq || 0));
    const cats = ["all", "Standing", "Balance", "Backbend", "Forward Fold", "Twist", "Hip Opener", "Core", "Restorative"];
    const filtered = filter === "all" ? POSES : POSES.filter((p) => p.category === filter);
    const speak = useCallback((text) => {
        if (!voiceCoach || !("speechSynthesis" in window))
            return;
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.95;
        speechSynthesis.speak(u);
    }, [voiceCoach]);
    const goToPose = useCallback((idx) => {
        if (seqIntervalRef.current)
            clearInterval(seqIntervalRef.current);
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
    }, [sequence, speak]);
    useEffect(() => {
        if (!seqRunning) {
            if (seqIntervalRef.current)
                clearInterval(seqIntervalRef.current);
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
        return () => { if (seqIntervalRef.current)
            clearInterval(seqIntervalRef.current); };
    }, [seqRunning, seqIndex, sequence.length, goToPose]);
    const extractYoutubeId = (url) => {
        const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : null;
    };
    const videoId = extractYoutubeId(videoUrl);
    if (inSequence) {
        const pose = seqIndex < sequence.length ? sequence[seqIndex] : null;
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-7", children: _jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Yoga Flow" }) }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-4 mb-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2.5", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em]", children: "Follow a Real Instructor (optional)" }), _jsx("button", { onClick: () => setVideoUrl(""), className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass", children: "Clear" })] }), _jsx("div", { className: "flex gap-2", children: _jsx("input", { value: videoUrl, onChange: (e) => setVideoUrl(e.target.value), placeholder: "Paste a YouTube link...", className: "flex-1 bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" }) }), videoId && (_jsx("div", { className: "mt-3 aspect-video rounded-lg overflow-hidden border border-line", children: _jsx("iframe", { src: `https://www.youtube.com/embed/${videoId}`, className: "w-full h-full", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }))] }), _jsx("div", { className: "flex justify-center items-center gap-4 mb-3.5", children: _jsxs("label", { className: "flex items-center gap-2 text-xs text-bone-dim uppercase tracking-[0.04em] cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: voiceCoach, onChange: (e) => setVoiceCoach(e.target.checked), className: "w-4 h-4 accent-brass" }), "Voice Coach (spoken cues)"] }) }), pose ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "font-['IBM_Plex_Mono'] text-xs text-bone-dim tracking-[0.05em] mb-2.5", children: ["Posture ", seqIndex + 1, "/", sequence.length] }), _jsx("div", { className: "h-1.5 bg-bg rounded-full overflow-hidden border border-line mb-4 max-w-[440px] mx-auto", children: _jsx("div", { className: "h-full bg-brass transition-all", style: { width: `${(seqIndex / sequence.length) * 100}%` } }) }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-8 text-center", children: [_jsx("svg", { viewBox: "0 0 90 90", className: "w-36 h-36 mx-auto text-brass", children: SHAPES[pose.shape] && _jsx("g", { dangerouslySetInnerHTML: { __html: SHAPES[pose.shape] } }) }), _jsx("div", { className: "text-2xl font-['Oswald'] uppercase tracking-wider text-bone mt-2.5", children: pose.name }), _jsx("div", { className: "text-sm text-brass italic mt-0.5", children: pose.sanskrit }), _jsx("div", { className: "font-['IBM_Plex_Mono'] text-4xl text-brass mt-4", children: seqRemaining }), _jsx("div", { className: "text-sm text-bone-dim max-w-[440px] mx-auto mt-3.5 leading-relaxed", children: pose.cue })] }), _jsxs("div", { className: "flex gap-2.5 justify-center mt-5 flex-wrap", children: [_jsxs("button", { onClick: () => goToPose(seqIndex - 1), className: "bg-transparent text-bone border border-line px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:border-brass hover:text-brass", children: [_jsx(ChevronLeft, { className: "w-3.5 h-3.5 inline mr-1" }), " Prev"] }), _jsxs("button", { onClick: () => setSeqRunning((r) => !r), className: `px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold
                  ${seqRunning ? "bg-brass text-[#1a1408] hover:bg-[#d69a4e]" : "bg-transparent text-bone border border-line hover:border-brass hover:text-brass"}`, children: [seqRunning ? _jsx(Pause, { className: "w-3.5 h-3.5 inline mr-1" }) : _jsx(Play, { className: "w-3.5 h-3.5 inline mr-1" }), seqRunning ? "Pause" : "Resume"] }), _jsxs("button", { onClick: () => goToPose(seqIndex + 1), className: "bg-transparent text-bone border border-line px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:border-brass hover:text-brass", children: ["Next ", _jsx(ChevronRight, { className: "w-3.5 h-3.5 inline ml-1" })] }), _jsx("button", { onClick: () => { setInSequence(false); setSeqRunning(false); speechSynthesis.cancel(); if (seqIntervalRef.current)
                                        clearInterval(seqIntervalRef.current); }, className: "bg-transparent text-danger border border-danger px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:opacity-80", children: "Exit Flow" })] })] })) : (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-['Oswald'] text-2xl text-brass mb-2", children: "Flow Complete" }), _jsx("p", { className: "text-sm text-bone-dim", children: "Nice work \u2014 that's the full 26-posture flow. Rest in Savasana as long as you like." }), _jsx("button", { onClick: () => setInSequence(false), className: "mt-4 bg-transparent text-bone border border-line px-4 py-2 rounded-md text-xs uppercase tracking-[0.03em] font-semibold hover:border-brass hover:text-brass", children: "Back to Library" })] }))] }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between items-end flex-wrap gap-3 mb-7", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Yoga" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5 max-w-[520px]", children: "50 poses across standing, backbend, forward fold, twist, balance, hip-opener, core and restorative." })] }), _jsxs("button", { onClick: () => { setInSequence(true); setSeqIndex(0); setSeqRemaining(sequence[0]?.hold || 30); }, className: "bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e]", children: [_jsx(Play, { className: "w-4 h-4 inline mr-1" }), " Start Guided Hot Yoga Flow"] })] }), _jsx("div", { className: "flex gap-2 mb-4 flex-wrap", children: cats.map((c) => (_jsx("button", { onClick: () => setFilter(c), className: `px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${filter === c ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`, children: c === "all" ? "All" : c }, c))) }), _jsxs("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3.5", children: [filtered.map((pose, i) => (_jsxs("button", { onClick: () => {
                            openModal(_jsxs("div", { className: "text-center", children: [_jsx("svg", { viewBox: "0 0 90 90", className: "w-28 h-28 mx-auto text-brass", children: SHAPES[pose.shape] && _jsx("g", { dangerouslySetInnerHTML: { __html: SHAPES[pose.shape] } }) }), _jsx("h2", { className: "text-lg font-['Oswald'] text-bone mt-2.5", children: pose.name }), _jsx("div", { className: "text-sm text-brass italic mb-2.5", children: pose.sanskrit }), _jsxs("div", { className: "flex justify-center gap-1.5 mb-3 flex-wrap", children: [_jsx("span", { className: "text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border border-line text-bone-dim", children: pose.category }), _jsx("span", { className: `text-[10px] uppercase tracking-[0.04em] px-2 py-0.5 rounded-full border
                      ${pose.difficulty === "Beginner" ? "border-moss-dim text-moss" : ""}
                      ${pose.difficulty === "Intermediate" ? "border-brass-dim text-brass" : ""}
                      ${pose.difficulty === "Advanced" ? "border-[#8a4c46] text-[#d97e6f]" : ""}`, children: pose.difficulty }), _jsxs("span", { className: "text-[10px] font-['IBM_Plex_Mono'] px-2 py-0.5 rounded-full border border-line text-bone-dim", children: ["~", pose.hold, "s hold"] })] }), _jsx("p", { className: "text-sm text-bone-dim leading-relaxed", children: pose.cue }), _jsxs("p", { className: "text-xs text-bone-dim mt-2", children: [_jsx("b", { className: "text-bone", children: "Focus:" }), " ", pose.focus] })] }));
                        }, className: "bg-surface border border-line rounded-[10px] p-3.5 text-center cursor-pointer transition-colors hover:border-brass-dim relative", children: [pose.seq && (_jsxs("div", { className: "absolute top-2.5 left-2.5 font-['IBM_Plex_Mono'] text-[10px] text-brass-dim", children: ["#", pose.seq] })), _jsx("svg", { viewBox: "0 0 90 90", className: "w-20 h-20 mx-auto text-brass", children: SHAPES[pose.shape] && _jsx("g", { dangerouslySetInnerHTML: { __html: SHAPES[pose.shape] } }) }), _jsx("div", { className: "font-semibold text-sm text-bone mt-2", children: pose.name }), _jsx("div", { className: "text-[10px] text-brass italic mt-0.5", children: pose.sanskrit }), _jsx("div", { className: "text-sm text-bone-dim mt-1 leading-relaxed", children: pose.focus }), _jsxs("div", { className: "flex justify-center gap-1.5 mt-2 flex-wrap", children: [_jsx("span", { className: "text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border border-line text-bone-dim", children: pose.category }), _jsx("span", { className: `text-[10px] uppercase tracking-[0.04em] px-2 py-0.5 rounded-full border
                ${pose.difficulty === "Beginner" ? "border-moss-dim text-moss" : ""}
                ${pose.difficulty === "Intermediate" ? "border-brass-dim text-brass" : ""}
                ${pose.difficulty === "Advanced" ? "border-[#8a4c46] text-[#d97e6f]" : ""}`, children: pose.difficulty })] })] }, i))), filtered.length === 0 && (_jsx("div", { className: "col-span-full text-center text-bone-dim text-sm py-5", children: "No poses in this category." }))] })] }));
}
/* ==================== NUTRITION VIEW ==================== */
function NutritionView({ nutritionState, updateNutrition, }) {
    const [nutView, setNutView] = useState("dashboard");
    const today = new Date().toISOString().slice(0, 10);
    const todayLogs = nutritionState.mealLogs.filter((m) => m.date === today);
    const totals = todayLogs.reduce((acc, log) => {
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
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    const goals = nutritionState.nutritionGoals;
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
    const MacroBar = ({ label, current, target, color }) => {
        const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
        return (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex justify-between text-xs text-bone-dim mb-1", children: [_jsx("span", { className: "uppercase tracking-[0.05em]", children: label }), _jsxs("span", { className: "font-['IBM_Plex_Mono']", children: [Math.round(current), " / ", target] })] }), _jsx("div", { className: "h-2 bg-bg rounded-full overflow-hidden border border-line", children: _jsx("div", { className: "h-full transition-all", style: { width: `${pct}%`, backgroundColor: color } }) })] }));
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-7", children: [_jsx("h1", { className: "text-[30px] font-['Oswald'] uppercase tracking-wider text-bone", children: "Nutrition" }), _jsx("div", { className: "text-sm text-bone-dim mt-1.5", children: "Track macros, browse foods, and plan your meals." })] }), _jsx("div", { className: "flex gap-2 mb-4 flex-wrap", children: [
                    { id: "dashboard", label: "Dashboard" },
                    { id: "foods", label: "Food Library" },
                    { id: "meals", label: "Meal Planner" },
                ].map((tab) => (_jsx("button", { onClick: () => setNutView(tab.id), className: `px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${nutView === tab.id ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`, children: tab.label }, tab.id))) }), nutView === "dashboard" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5 mb-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em]", children: "Today's Macros" }), _jsx("button", { onClick: () => {
                                            const goalsNew = prompt("Enter new targets as: kcal,protein,g,carbs,fat", `${goals.kcal},${goals.protein},${goals.carbs},${goals.fat}`);
                                            if (goalsNew) {
                                                const parts = goalsNew.split(",").map(Number);
                                                if (parts.length === 4) {
                                                    updateNutrition((s) => ({
                                                        ...s,
                                                        nutritionGoals: { kcal: parts[0], protein: parts[1], carbs: parts[2], fat: parts[3] },
                                                    }));
                                                }
                                            }
                                        }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass", children: "Edit Targets" })] }), _jsx(MacroBar, { label: "Calories", current: totals.kcal, target: goals.kcal, color: "#c68a3e" }), _jsx(MacroBar, { label: "Protein", current: totals.protein, target: goals.protein, color: "#7ea366" }), _jsx(MacroBar, { label: "Carbs", current: totals.carbs, target: goals.carbs, color: "#8fa0c9" }), _jsx(MacroBar, { label: "Fat", current: totals.fat, target: goals.fat, color: "#d97e6f" })] }), mealTypes.map((mt) => {
                        const mealLog = todayLogs.find((l) => l.mealType === mt);
                        const mealFoods = mealLog
                            ? mealLog.foodIds.map((fid) => nutritionState.foods.find((f) => f.id === fid)).filter(Boolean)
                            : [];
                        return (_jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5 mb-3", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em]", children: mt }), _jsxs("button", { onClick: () => {
                                                const allFoods = nutritionState.foods;
                                                const items = allFoods.map((f) => `${f.id}: ${f.name} (${f.kcal}kcal, ${f.protein}g protein)`).join("\n");
                                                const input = prompt(`Enter food IDs to add (comma-separated):\n\n${items}`);
                                                if (input) {
                                                    const ids = input.split(",").map((x) => x.trim()).filter((x) => allFoods.find((f) => f.id === x));
                                                    if (ids.length > 0) {
                                                        updateNutrition((s) => {
                                                            const existing = s.mealLogs.filter((m) => !(m.date === today && m.mealType === mt));
                                                            return {
                                                                ...s,
                                                                mealLogs: [...existing, { id: uid(), date: today, mealType: mt, foodIds: ids }],
                                                            };
                                                        });
                                                    }
                                                }
                                            }, className: "text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass", children: [_jsx(Plus, { className: "w-3 h-3 inline mr-0.5" }), " Add"] })] }), mealFoods.length > 0 ? (_jsxs("div", { className: "space-y-1", children: [mealFoods.map((f, i) => (_jsxs("div", { className: "flex justify-between text-sm text-bone-dim", children: [_jsx("span", { children: f.name }), _jsxs("span", { className: "font-['IBM_Plex_Mono'] text-xs", children: [f.kcal, "kcal"] })] }, i))), _jsxs("div", { className: "border-t border-line pt-1 mt-1 flex justify-between text-sm text-bone font-['IBM_Plex_Mono']", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: [Math.round(mealFoods.reduce((a, f) => a + f.kcal, 0)), "kcal"] })] })] })) : (_jsx("div", { className: "text-sm text-bone-dim", children: "No foods logged." }))] }, mt));
                    })] })), nutView === "foods" && (_jsx(FoodLibraryView, { foods: nutritionState.foods })), nutView === "meals" && (_jsx(MealPlannerView, { mealSuggestions: nutritionState.mealSuggestions, foods: nutritionState.foods, nutritionState: nutritionState, updateNutrition: updateNutrition }))] }));
}
function FoodLibraryView({ foods }) {
    const [foodFilter, setFoodFilter] = useState("all");
    const cats = ["all", "protein", "legumes", "grains", "vegetables", "fruits", "nuts", "dairy"];
    const filtered = foodFilter === "all" ? foods : foods.filter((f) => f.category === foodFilter);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex gap-2 mb-4 flex-wrap", children: cats.map((c) => (_jsx("button", { onClick: () => setFoodFilter(c), className: `px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.03em] border
              ${foodFilter === c ? "bg-brass border-brass text-[#1a1408]" : "border-line text-bone-dim"}`, children: c }, c))) }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5", children: [filtered.map((f) => (_jsxs("div", { className: "flex justify-between items-center gap-3 py-3.5 border-b border-line last:border-b-0", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "font-semibold text-sm text-bone", children: [f.name, f.plantBased && _jsx("span", { className: "text-[10px] text-moss ml-2", children: "\uD83C\uDF31" })] }), _jsx("div", { className: "text-xs text-bone-dim mt-0.5", children: f.servingSize })] }), _jsxs("div", { className: "flex gap-3 text-xs font-['IBM_Plex_Mono'] text-bone-dim shrink-0", children: [_jsxs("span", { children: [f.kcal, "kcal"] }), _jsxs("span", { className: "text-moss", children: [f.protein, "g"] }), _jsxs("span", { children: [f.carbs, "g"] }), _jsxs("span", { children: [f.fat, "g"] })] })] }, f.id))), filtered.length === 0 && (_jsx("div", { className: "text-center text-bone-dim text-sm py-5", children: "No foods in this category." }))] })] }));
}
function MealPlannerView({ mealSuggestions, foods, nutritionState, updateNutrition, }) {
    const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10));
    const dayMeals = nutritionState.mealLogs.filter((m) => m.date === selectedDay);
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
    const dayTotals = dayMeals.reduce((acc, log) => {
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
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + i);
        return d.toISOString().slice(0, 10);
    });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em] mb-2", children: "Meal Suggestions" }), _jsx("div", { className: "grid grid-cols-2 max-lg:grid-cols-1 gap-3", children: mealSuggestions.map((m) => (_jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-3.5", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-semibold text-sm text-bone", children: m.name }), _jsx("div", { className: "text-xs text-bone-dim mt-0.5", children: m.ingredients.join(", ") })] }), _jsx("span", { className: `text-[10px] uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border shrink-0 ml-2
                  ${m.plantBased ? "border-moss-dim text-moss" : "border-line text-bone-dim"}`, children: m.plantBased ? "Plant" : "Standard" })] }), _jsxs("div", { className: "flex gap-3 mt-2 text-xs font-['IBM_Plex_Mono'] text-bone-dim", children: [_jsxs("span", { children: [m.kcal, "kcal"] }), _jsxs("span", { className: "text-moss", children: [m.protein, "g"] }), _jsxs("span", { children: [m.carbs, "g"] }), _jsxs("span", { children: [m.fat, "g"] })] }), _jsxs("button", { onClick: () => {
                                        const foodIds = m.ingredients
                                            .map((ing) => foods.find((f) => f.name.toLowerCase().includes(ing.split(" ")[0].toLowerCase())))
                                            .filter(Boolean)
                                            .map((f) => f.id);
                                        if (foodIds.length > 0) {
                                            updateNutrition((s) => {
                                                const existing = s.mealLogs.filter((ml) => !(ml.date === selectedDay && ml.mealType === m.mealType));
                                                return {
                                                    ...s,
                                                    mealLogs: [...existing, { id: uid(), date: selectedDay, mealType: m.mealType, foodIds }],
                                                };
                                            });
                                        }
                                    }, className: "mt-2 text-[11px] uppercase tracking-[0.03em] bg-transparent text-bone border border-line px-2 py-1 rounded-md hover:border-brass hover:text-brass", children: [_jsx(Plus, { className: "w-3 h-3 inline mr-0.5" }), " Add to ", selectedDay] })] }, m.id))) })] }), _jsxs("div", { className: "bg-surface border border-line rounded-[10px] p-5", children: [_jsx("h3", { className: "text-sm text-brass uppercase tracking-[0.05em] mb-3", children: "Weekly Overview" }), _jsx("div", { className: "flex gap-2 mb-4 flex-wrap", children: days.map((d) => (_jsxs("button", { onClick: () => setSelectedDay(d), className: `px-3 py-1.5 rounded-md text-xs uppercase tracking-[0.04em] border
                ${d === selectedDay ? "border-brass text-brass bg-brass/10" : "border-line text-bone-dim"}`, children: [new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }), _jsx("div", { className: "font-['IBM_Plex_Mono'] text-[10px] opacity-70", children: d.slice(5) })] }, d))) }), mealTypes.map((mt) => {
                        const log = dayMeals.find((m) => m.mealType === mt);
                        const mealFoods = log
                            ? log.foodIds.map((fid) => foods.find((f) => f.id === fid)).filter(Boolean)
                            : [];
                        return (_jsxs("div", { className: "flex items-center gap-3 py-2.5 border-b border-line last:border-b-0", children: [_jsx("div", { className: "w-20 shrink-0", children: _jsx("span", { className: "text-[11px] uppercase tracking-[0.05em] text-brass", children: mt }) }), _jsx("div", { className: "flex-1", children: mealFoods.length > 0 ? (_jsx("div", { className: "text-sm text-bone-dim", children: mealFoods.map((f) => f.name).join(", ") })) : (_jsx("div", { className: "text-sm text-bone-dim opacity-50", children: "Not planned" })) }), _jsxs("div", { className: "text-xs font-['IBM_Plex_Mono'] text-bone-dim shrink-0", children: [Math.round(mealFoods.reduce((a, f) => a + f.kcal, 0)), "kcal"] })] }, mt));
                    }), _jsxs("div", { className: "flex justify-between items-center pt-3 mt-1 border-t border-line", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.05em] text-bone", children: "Daily Total" }), _jsxs("span", { className: "text-sm font-['IBM_Plex_Mono'] text-brass", children: [Math.round(dayTotals.kcal), "kcal \u00B7 ", Math.round(dayTotals.protein), "g P \u00B7 ", Math.round(dayTotals.carbs), "g C \u00B7 ", Math.round(dayTotals.fat), "g F"] })] })] })] }));
}
/* ==================== ROOT APP ==================== */
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(WorkoutApp, {}) }));
}
