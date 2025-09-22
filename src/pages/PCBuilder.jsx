import { useEffect, useMemo, useState } from "react";
import Row from "../components/Row.jsx";
import PartPicker from "../components/PartPicker.jsx";
import Badge from "../components/Badge.jsx";
import toast from "react-hot-toast";
import {
  getCpus, getGpus, getMotherboardsForCpu, getRamsForMotherboard, getCasesForMotherboard,
  getSSDs, getHDDs, getPsus, getFans, verifyBuild, createDraftBuild, submitBuildRequest,
} from "../api/parts";
import { useNavigate } from "react-router-dom";

export default function PCBuilder() {
  const nav = useNavigate();

  // selections
  const [cpu, setCpu] = useState(null);
  const [mb, setMb] = useState(null);
  const [ram, setRam] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [pcCase, setCase] = useState(null);
  const [ssd, setSsd] = useState(null);
  const [hdd, setHdd] = useState(null);
  const [psu, setPsu] = useState(null);
  const [fans, setFans] = useState([]); // multi-select

  // data
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
  const [price, setPrice] = useState({ subtotal: 0, total: 0 });

  // fetch static lists
  useEffect(() => {
    (async () => {
      const [C, G, S, H, P, F] = await Promise.all([
        getCpus(), getGpus(), getSSDs(), getHDDs(), getPsus(), getFans()
      ]);
      setCpus(C); setGpus(G); setSsds(S); setHdds(H); setPsus(P); setAllFans(F);
    })().catch((e) => console.error(e));
  }, []);

  // when CPU changes, load compatible motherboards
  useEffect(() => {
    setMb(null); setRams([]); setRam(null);
    if (!cpu) { setBoards([]); return; }
    getMotherboardsForCpu(cpu.productId, "brand+socket")
      .then(d => setBoards(d.boards || []))
      .catch(() => setBoards([]));
  }, [cpu]);

  // when MB changes, load compatible RAMs
  useEffect(() => {
    setRam(null);
    if (!mb) { setRams([]); return; }
    getRamsForMotherboard(mb.productId)
      .then(d => setRams(d.rams || []))
      .catch(() => setRams([]));
  }, [mb]);

  // when MB/GPU change, load compatible cases
  useEffect(() => {
    setCase(null);
    if (!mb) { setCases([]); return; }
    const len = gpu?.lengthMM ? Number(gpu.lengthMM) : undefined;
    getCasesForMotherboard(mb.productId, len)
      .then(d => setCases(d.cases || []))
      .catch(() => setCases([]));
  }, [mb, gpu]);

  // live totals on the client
  useEffect(() => {
    const numbers = [
      cpu?.price, mb?.price, ram?.price, gpu?.price, pcCase?.price,
      ssd?.price, hdd?.price, psu?.price,
      ...(fans || []).map(f => f.price)
    ].filter((n) => !Number.isNaN(Number(n)));
    const subtotal = numbers.reduce((s, n) => s + Number(n || 0), 0);
    setPrice({ subtotal, total: subtotal });
  }, [cpu, mb, ram, gpu, pcCase, ssd, hdd, psu, fans]);

  const doVerify = async () => {
    if (!(cpu && mb && ram && gpu && pcCase)) {
      toast.error("Pick CPU, MB, RAM, GPU and Case first");
      return;
    }
    setBusy(true);
    try {
      const res = await verifyBuild({
        cpuId: cpu.productId,
        motherboardId: mb.productId,
        ramId: ram.productId,
        gpuId: gpu.productId,
        caseId: pcCase.productId,
      });
      setCompat({ ok: res.ok !== false, errors: res.errors || [] });
      res.ok ? toast.success("Build is compatible!") : toast.error("Incompatible — see issues");
    } catch (e) {
      const msg = e?.response?.data?.message || "Verification failed";
      const errors = e?.response?.data?.errors || [];
      setCompat({ ok: false, errors: errors.length ? errors : [msg] });
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = async () => {
    if (!compat.ok) { toast.error("Verify first and fix any issues"); return; }
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
      if (res?.buildId) {
        toast.success("Draft saved");
        nav(`/preview/${encodeURIComponent(res.buildId)}`);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to save build");
    } finally {
      setBusy(false);
    }
  };

  const submitRequest = async () => {
    if (!(cpu && mb && ram && gpu && pcCase)) {
      toast.error("Pick the core parts first");
      return;
    }
    setBusy(true);
    try {
      const buildSnapshot = {
        items: { cpu, motherboard: mb, ram, gpu, case: pcCase, ssd, hdd, psu, fans },
        prices: price,
        compatibility: compat,
        name: [cpu?.model, gpu?.model, ram ? `${ram.kitCapacity}GB` : ""].filter(Boolean).join(" + "),
      };
      const res = await submitBuildRequest({ build: buildSnapshot, user: {} });
      toast.success(`Submitted! Request ID: ${res?.requestId}`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Submit failed");
    } finally {
      setBusy(false);
    }
  };

  const canVerify = cpu && mb && ram && gpu && pcCase;
  const canSave = canVerify && compat.ok && !busy;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: pickers */}
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
          <h2 className="text-lg font-semibold tracking-wide mb-3">Core Parts</h2>
          <Row label="CPU" right={<PartPicker title="CPU" items={cpus} value={cpu} onChange={setCpu} placeholder="Search CPU" />} />
          <Row label="Motherboard" right={<PartPicker title="Motherboards (compatible)" items={boards} value={mb} onChange={setMb} placeholder="Search board" />} />
          <Row label="RAM" right={<PartPicker title="RAM (compatible)" items={rams} value={ram} onChange={setRam} placeholder="Search RAM" />} />
          <Row label="GPU" right={<PartPicker title="GPU" items={gpus} value={gpu} onChange={setGpu} placeholder="Search GPU" />} />
          <Row label="Case" right={<PartPicker title="Cases (compatible)" items={cases} value={pcCase} onChange={setCase} placeholder="Search case" />} />
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
          <h2 className="text-lg font-semibold tracking-wide mb-3">Storage & Power</h2>
          <Row label="SSD" right={<PartPicker title="SSD" items={ssds} value={ssd} onChange={setSsd} />} />
          <Row label="HDD" right={<PartPicker title="HDD" items={hdds} value={hdd} onChange={setHdd} />} />
          <Row label="PSU" right={<PartPicker title="PSU" items={psus} value={psu} onChange={setPsu} />} />
          <Row
            label="Fans (multi)"
            right={
              <div className="space-y-2">
                <PartPicker
                  title="Fans"
                  items={allFans}
                  value={null}
                  onChange={(f) =>
                    setFans((prev) =>
                      prev.find((x) => x.productId === f.productId) ? prev : [...prev, f]
                    )
                  }
                />
                <div className="flex flex-wrap gap-2">
                  {fans.map((f) => (
                    <Badge key={f.productId} tone="info">
                      {f.brand} {f.model}
                      <button
                        className="ml-2 text-slate-300/70 hover:text-rose-300"
                        onClick={() =>
                          setFans((prev) => prev.filter((x) => x.productId !== f.productId))
                        }
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Right: Summary */}
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
          <h2 className="text-lg font-semibold tracking-wide mb-3">Summary</h2>
          <div className="grid gap-2 text-sm">
            {[
              ["CPU", cpu],
              ["Motherboard", mb],
              ["RAM", ram],
              ["GPU", gpu],
              ["Case", pcCase],
              ["SSD", ssd],
              ["HDD", hdd],
              ["PSU", psu],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-slate-800/60 py-2">
                <span className="text-slate-300">{k}</span>
                <span className="text-right text-slate-200">{v ? `${v.brand || ""} ${v.model || v.productId}` : "-"}</span>
              </div>
            ))}

            {!!fans.length && (
              <div className="pt-2">
                <div className="text-slate-300 mb-1">Fans</div>
                <div className="flex flex-wrap gap-2">
                  {fans.map((f) => (
                    <Badge key={f.productId}>{f.brand} {f.model}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-slate-900/60 border border-slate-800/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Subtotal</span>
              <span className="font-semibold">LKR {price.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-slate-300">Total</span>
              <span className="text-sky-300 font-semibold">LKR {price.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={doVerify}
              disabled={!canVerify || busy}
              className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 disabled:opacity-50"
            >
              {busy ? "Checking…" : "Verify Compatibility"}
            </button>
            <button
              onClick={saveDraft}
              disabled={!canSave || busy}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50"
            >
              Save Draft Build
            </button>
            <button
              onClick={submitRequest}
              disabled={!canVerify || busy}
              className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50"
            >
              Submit Build Request
            </button>
          </div>

          <div className="mt-4">
            {compat.ok ? (
              <Badge tone="ok">✅ Build is compatible</Badge>
            ) : (
              compat.errors?.length ? (
                <div className="rounded-xl border border-rose-700/50 bg-rose-950/40 p-3">
                  <div className="text-sm font-medium text-rose-200 mb-1">Compatibility Issues</div>
                  <ul className="list-disc list-inside text-sm text-rose-200/90">
                    {compat.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              ) : (
                <Badge tone="info">ℹ️ Pick parts and click Verify</Badge>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
