import { useEffect, useMemo, useState } from "react";
import { industriesById, itCalculatorsById, useCasesByKey } from "./data/platform";

function normalizeHash(hash) {
  const raw = hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function parseRoute(path) {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { view: "home", path: "/" };
  }

  if (segments.length === 1 && segments[0] === "lob") {
    return { view: "lob-home", path };
  }

  if (segments.length === 1 && segments[0] === "it") {
    return { view: "it-home", path };
  }

  if (segments.length === 1 && segments[0] === "review") {
    return { view: "review", path };
  }

  if (segments[0] === "it" && segments.length === 2) {
    const calculator = itCalculatorsById[segments[1]];
    return calculator
      ? {
          view: "it-calculator",
          path,
          useCaseId: calculator.id,
        }
      : { view: "not-found", path };
  }

  if (segments[0] !== "industries") {
    return { view: "not-found", path };
  }

  if (segments.length === 2) {
    const industry = industriesById[segments[1]];
    return industry
      ? { view: "industry", path, industryId: industry.id }
      : { view: "not-found", path };
  }

  if (segments.length === 3) {
    const calculator = useCasesByKey[`${segments[1]}/${segments[2]}`];
    return calculator
      ? {
          view: "calculator",
          path,
          industryId: calculator.industryId,
          useCaseId: calculator.id,
        }
      : { view: "not-found", path };
  }

  return { view: "not-found", path };
}

export function buildHomePath() {
  return "/";
}

export function buildReviewPath() {
  return "/review";
}

export function buildLobPath() {
  return "/lob";
}

export function buildItPath() {
  return "/it";
}

export function buildIndustryPath(industryId) {
  return `/industries/${industryId}`;
}

export function buildCalculatorPath(industryId, useCaseId) {
  return `/industries/${industryId}/${useCaseId}`;
}

export function buildItCalculatorPath(useCaseId) {
  return `/it/${useCaseId}`;
}

export function navigateTo(path) {
  window.location.hash = path;
}

export function useHashRoute() {
  const [path, setPath] = useState(() => normalizeHash(window.location.hash));

  useEffect(() => {
    function handleHashChange() {
      setPath(normalizeHash(window.location.hash));
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return useMemo(() => parseRoute(path), [path]);
}
