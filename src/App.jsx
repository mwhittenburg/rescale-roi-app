import { AppShell } from "./components/AppShell";
import { CalculatorPage } from "./pages/CalculatorPage";
import { ItHomePage } from "./pages/ItHomePage";
import { LobHomePage } from "./pages/LobHomePage";
import { HomePage } from "./pages/HomePage";
import { IndustryPage } from "./pages/IndustryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReviewIndexPage } from "./pages/ReviewIndexPage";
import {
  industries,
  industriesById,
  itCalculatorsById,
  itPath,
  useCasesByKey,
} from "./data/platform";
import {
  buildHomePath,
  buildIndustryPath,
  buildItPath,
  buildLobPath,
  navigateTo,
  useHashRoute,
} from "./router";

function App() {
  const route = useHashRoute();

  let page = <NotFoundPage onNavigate={navigateTo} />;

  if (route.view === "home") {
    page = <HomePage onNavigate={navigateTo} />;
  }

  if (route.view === "lob-home") {
    page = <LobHomePage onNavigate={navigateTo} />;
  }

  if (route.view === "it-home") {
    page = <ItHomePage itPath={itPath} onNavigate={navigateTo} />;
  }

  if (route.view === "review") {
    page = (
      <ReviewIndexPage
        industries={industries}
        itPath={itPath}
        onNavigate={navigateTo}
      />
    );
  }

  if (route.view === "industry") {
    const industry = industriesById[route.industryId];
    page = (
      <IndustryPage
        industry={industry}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: "Build ROI for Line of Business", path: buildLobPath() },
          { label: industry.name },
        ]}
        onNavigate={navigateTo}
      />
    );
  }

  if (route.view === "calculator") {
    const industry = industriesById[route.industryId];
    const calculator = useCasesByKey[`${route.industryId}/${route.useCaseId}`];
    page = (
      <CalculatorPage
        contextName={industry.name}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: "Build ROI for Line of Business", path: buildLobPath() },
          { label: industry.name, path: buildIndustryPath(industry.id) },
          { label: calculator.name },
        ]}
        calculator={calculator}
        onNavigate={navigateTo}
      />
    );
  }

  if (route.view === "it-calculator") {
    const calculator = itCalculatorsById[route.useCaseId];
    page = (
      <CalculatorPage
        contextName={itPath.name}
        breadcrumbs={[
          { label: "Home", path: buildHomePath() },
          { label: "Build TCO for IT", path: buildItPath() },
          { label: calculator.name },
        ]}
        calculator={calculator}
        onNavigate={navigateTo}
      />
    );
  }

  return <AppShell>{page}</AppShell>;
}

export default App;
