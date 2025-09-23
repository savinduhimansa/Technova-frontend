import { useEffect, useMemo, useState } from "react";
import Stepper from "../../components/Stepper.jsx";
import Row from "../../components/Row.jsx";
import PartPicker from "../../components/PartPicker.jsx";
import SummaryCard from "../../components/SummaryCard.jsx";
import {
  getCpus, getGpus, getMotherboardsForCpu, getRamsForMotherboard, getCasesForMotherboard,
  getSSDs, getHDDs, getPsus, getFans, verifyBuild, createDraftBuild, submitDraft, getBuild,
} from "../../api/parts.js";

const STEPS = [
  "CPU Brand",
  "CPU",
  "Motherboard",
  "RAM",
  "GPU",
  "Case",
  "Storage & PSU",
  "Fans",
  "Summary",
];

export default function BuilderWizard() {
  const [active, setActive] = useState(0);

  // brand first (strict AMD/Intel gate)
  const [brand, setBrand] = useState(null);

  // selections
  const [cpu, setCpu] = useState(null);
  const [mb, setMb] = useState(null);
  const [ram, setRam] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [pcCase, setCase] = useState(null);
  const [ssd, setSsd] = useState(null);
  const [hdd, setHdd] = useState(null);
  const [psu, setPsu] = useState(null);
  const [fans, setFans] = useState([]);

  // data lists
  const [cpus, setCpus] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [boards, setBoards] = useState([]);
  const [rams, setRams] = useState([]);
  const [cases, setCases] = useState([]);
  const [ssds, setSsds] = useState([]);
  const [hdds, setHdds] = useState([]);
  const [psus, setPsus] = useState([]);
  const [allFans, setAllFans] = useState([]);

  // status
  const [busy, setBusy] = useState(false);
  const [compat, setCompat] = useState({ ok: false, errors: [] });
  const [savedBuildId, setSavedBuildId] = useState(null);

  // preload non-dependent lists
  useEffect(() => {
    (async () => {
      const [G, S, H, P, F] = await Promise.all([getGpus(), getSSDs(), getHDDs(), getPsus(), getFans()]);
      setGpus(G); setSsds(S); setHdds(H); setPsus(P); setAllFans(F);
    })().catch(console.error);
  }, []);

  // when brand is picked, fetch CPUs by brand
  useEffect(() => {
    setCpu(null); setMb(null); setRam(null); setCase(null);
    setBoards([]); setRams([]); setCases([]); setSavedBuildId(null);
    setCompat({ ok: false, errors: [] });
    if (!brand) { setCpus([]); return; }
    getCpus(brand).then(setCpus).catch(() => setCpus([]));
  }, [brand]);

  // when CPU changes, load compatible motherboards
  useEffect(() => {
    setMb(null); setRams([]); setRam(null); setSavedBuildId(null);
    setCompat({ ok: false, errors: [] });
    if (!cpu) { setBoards([]); return; }
    getMotherboardsForCpu(cpu.productId, "brand+socket")
      .then(d => setBoards(d.boards || []))
      .catch(() => setBoards([]));
  }, [cpu]);

  // when MB changes, load compatible RAMs
  useEffect(() => {
    setRam(null); setSavedBuildId(null);
    setCompat({ ok: false, errors: [] });
    if (!mb) { setRams([]); return; }
    getRamsForMotherboard(mb.productId)
      .then(d => setRams(d.rams || []))
      .catch(() => setRams([]));
  }, [mb]);

  // when MB/GPU change, load compatible cases
  useEffect(() => {
    setCase(null); setSavedBuildId(null);
    setCompat({ ok: false, errors: [] });
    if (!mb) { setCases([]); return; }
    const len = gpu?.lengthMM ? Number(gpu.lengthMM) : undefined;
    getCasesForMotherboard(mb.productId, len)
      .then(d => setCases(d.cases || []))
      .catch(() => setCases([]));
  }, [mb, gpu]);

  // AUTO-VERIFY whenever the core set is available or changes
  useEffect(() => {
    const coreReady = cpu && mb && ram && gpu && pcCase;
    if (!coreReady) {
      setCompat({ ok: false, errors: [] });
      return;
    }
    let alive = true;
    (async () => {
      try {
        setBusy(true);
        const res = await verifyBuild({
          cpuId: cpu.productId,
          motherboardId: mb.productId,
          ramId: ram.productId,
          gpuId: gpu.productId,
          caseId: pcCase.productId,
        });
        if (!alive) return;
        setCompat({ ok: res.ok !== false, errors: res.errors || [] });
      } catch (e) {
        if (!alive) return;
        const msg = e?.response?.data?.message || "Verification failed";
        const errors = e?.response?.data?.errors || [];
        setCompat({ ok: false, errors: errors.length ? errors : [msg] });
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => { alive = false; };
  }, [cpu, mb, ram, gpu, pcCase]);

  // totals
  const totals = useMemo(() => {
    const numbers = [
      cpu?.price, mb?.price, ram?.price, gpu?.price, pcCase?.price,
      ssd?.price, hdd?.price, psu?.price, ...(fans || []).map(f => f.price)
    ].filter((n) => !Number.isNaN(Number(n)));
    const subtotal = numbers.reduce((s, n) => s + Number(n || 0), 0);
    return { subtotal, total: subtotal };
  }, [cpu, mb, ram, gpu, pcCase, ssd, hdd, psu, fans]);

  const canNext = () => {
    switch (active) {
      case 0: return !!brand;
      case 1: return !!cpu;
      case 2: return !!mb;
      case 3: return !!ram;
      case 4: return !!gpu;
      case 5: return !!pcCase;
      case 6: return !!(ssd || hdd || psu); // pick at least one in this step
      case 7: return true; // fans optional
      default: return true;
    }
  };

  const next = () => setActive((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setActive((i) => Math.max(i - 1, 0));

  const saveDraft = async () => {
    if (!compat.ok) {
      alert("Fix compatibility issues first.");
      return;
    }
    setBusy(true);
    try {
      const res = await createDraftBuild({
        cpuId: cpu?.productId,
        motherboardId: mb?.productId,
        ramId: ram?.productId,
        gpuId: gpu?.productId,
        caseId: pcCase?.productId,
        ssdId: ssd?.productId,
        hddId: hdd?.productId,
        psuId: psu?.productId,
        fanIds: (fans || []).map(f => f.productId),
      });
      setSavedBuildId(res?.buildId || null);
      if (res?.buildId) await getBuild(res.buildId); // (optional) refresh snapshot if needed
      alert("Draft saved.");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save build");
    } finally {
      setBusy(false);
    }
  };

  const submitForReview = async () => {
    if (!savedBuildId) {
      alert("Save the draft first.");
      return;
    }
    setBusy(true);
    try {
      const res = await submitDraft(savedBuildId);
      alert(res?.message || "Submitted for approval");
    } catch (e) {
      alert(e?.response?.data?.message || "Submit failed");
    } finally {
      setBusy(false);
    }
  };

  const selected = { cpu, mb, ram, gpu, case: pcCase, ssd, hdd, psu };

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} activeIndex={active} />

      {/* Step content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: step panels */}
        <section className="space-y-6">
          {active === 0 && (
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6">
              <h2 className="text-lg font-semibold mb-4">Choose CPU Brand</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setBrand("AMD")}
                  className={`px-4 py-2 rounded-xl border ${brand==="AMD" ? "border-sky-600 bg-sky-900/40" : "border-slate-700 bg-slate-900/40"} hover:border-sky-600`}
                >
                  AMD
                </button>
                <button
                  onClick={() => setBrand("Intel")}
                  className={`px-4 py-2 rounded-xl border ${brand==="Intel" ? "border-sky-600 bg-sky-900/40" : "border-slate-700 bg-slate-900/40"} hover:border-sky-600`}
                >
                  Intel
                </button>
              </div>
            </div>
          )}

          {active === 1 && (
            <Row label="CPU" right={<PartPicker title={`CPU (${brand || "pick brand"})`} items={cpus} value={cpu} onChange={setCpu} />} />
          )}

          {active === 2 && (
            <Row label="Motherboard" right={<PartPicker title="Motherboards (compatible)" items={boards} value={mb} onChange={setMb} />} />
          )}

          {active === 3 && (
            <Row label="RAM" right={<PartPicker title="RAM (compatible)" items={rams} value={ram} onChange={setRam} />} />
          )}

          {active === 4 && (
            <Row label="GPU" right={<PartPicker title="GPU" items={gpus} value={gpu} onChange={setGpu} />} />
          )}

          {active === 5 && (
            <Row label="Case" right={<PartPicker title="Cases (compatible)" items={cases} value={pcCase} onChange={setCase} />} />
          )}

          {active === 6 && (
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 space-y-4">
              <Row label="SSD" right={<PartPicker title="SSD" items={ssds} value={ssd} onChange={setSsd} />} />
              <Row label="HDD" right={<PartPicker title="HDD" items={hdds} value={hdd} onChange={setHdd} />} />
              <Row label="PSU" right={<PartPicker title="PSU" items={psus} value={psu} onChange={setPsu} />} />
            </div>
          )}

          {active === 7 && (
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 space-y-4">
              <Row
                label="Fans"
                hint="Select multiple; they’ll add to the total"
                right={
                  <PartPicker
                    title="Fans"
                    items={allFans}
                    value={null}
                    onChange={(f) => setFans((prev) => prev.find(x => x.productId === f.productId) ? prev : [...prev, f])}
                  />
                }
              />
              {!!fans.length && (
                <div className="flex flex-wrap gap-2">
                  {fans.map((f) => (
                    <span key={f.productId} className="text-xs px-2 py-1 rounded-full border border-slate-700 bg-slate-900/50">
                      {f.brand} {f.model}
                      <button className="ml-2 text-slate-300/70 hover:text-rose-300" onClick={() => setFans(prev => prev.filter(x => x.productId !== f.productId))}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="flex gap-3">
            <button onClick={back} disabled={active === 0} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50">Back</button>
            {active < STEPS.length - 1 && (
              <button onClick={next} disabled={!canNext()} className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 disabled:opacity-50">Next</button>
            )}
          </div>
        </section>

        {/* RIGHT: summary & actions */}
        <section className="space-y-6">
          <SummaryCard selected={selected} fans={fans} totals={totals} />

          {/* Always show live compatibility (auto-verify) */}
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 space-y-4">
            <div className="text-sm">
              {busy ? (
                <div className="text-slate-300">Checking compatibility…</div>
              ) : compat.ok ? (
                <div className="text-emerald-200">✅ Build is compatible.</div>
              ) : (cpu && mb && ram && gpu && pcCase) ? (
                <div className="text-rose-200">
                  ❌ Incompatible:
                  <ul className="list-disc list-inside mt-2">
                    {compat.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="text-slate-300">Pick CPU, Motherboard, RAM, GPU and Case to auto-verify.</div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={saveDraft} disabled={!compat.ok || busy} className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50">
                Save Draft
              </button>
              <button onClick={submitForReview} disabled={!savedBuildId || busy} className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50">
                Submit for Review
              </button>
            </div>

            <div className="text-xs text-slate-400">
              After approval, your current backend lets **admins** mark a build as <code>purchased</code>. If you want a user-side purchase endpoint, add it and I’ll hook it up here.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
