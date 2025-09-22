import { api, toUrl } from "./http";

// Public lists
export const getCpus = (brand) =>
  api.get(toUrl(`/api/parts/cpus${brand ? `?brand=${encodeURIComponent(brand)}` : ""}`)).then(r => r.data);

export const getGpus = () => api.get(toUrl(`/api/parts/gpus`)).then(r => r.data);
export const getSSDs = () => api.get(toUrl(`/api/parts/ssds`)).then(r => r.data);
export const getHDDs = () => api.get(toUrl(`/api/parts/hdds`)).then(r => r.data);
export const getPsus = () => api.get(toUrl(`/api/parts/psus`)).then(r => r.data);
export const getFans = () => api.get(toUrl(`/api/parts/fans`)).then(r => r.data);

// Compatibility
export const getMotherboardsForCpu = (cpuId, mode = "brand+socket") =>
  api.get(toUrl(`/api/parts/motherboards/compatible?cpuId=${encodeURIComponent(cpuId)}&mode=${mode}`))
     .then(r => r.data); // { cpu, boards }

export const getRamsForMotherboard = (motherboardId) =>
  api.get(toUrl(`/api/parts/rams/compatible?motherboardId=${encodeURIComponent(motherboardId)}`))
     .then(r => r.data); // { motherboard, rams }

export const getCasesForMotherboard = (motherboardId, gpuLengthMM) =>
  api.get(toUrl(`/api/parts/cases/compatible?motherboardId=${encodeURIComponent(motherboardId)}${gpuLengthMM ? `&gpuLengthMM=${gpuLengthMM}` : ""}`))
     .then(r => r.data); // { motherboard, cases }

// Verify (public)
export const verifyBuild = (payload) =>
  api.post(toUrl(`/api/parts/builds/verify`), payload).then(r => r.data);

// Save draft build (JWT optional if your middleware allows)
export const createDraftBuild = (payload) =>
  api.post(toUrl(`/api/parts/builds`), payload).then(r => r.data);

// Read saved build
export const getBuild = (buildId) =>
  api.get(toUrl(`/api/parts/builds/${encodeURIComponent(buildId)}`)).then(r => r.data);

// Build Requests (public submit)
export const submitBuildRequest = (payload) =>
  api.post(toUrl(`/api/build-requests/submit`), payload).then(r => r.data);
