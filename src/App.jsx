import { AppShell } from "./components/AppShell";
import { CalculatorPage } from "./pages/CalculatorPage";
import { HomePage } from "./pages/HomePage";
import { IndustryPage } from "./pages/IndustryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReviewIndexPage } from "./pages/ReviewIndexPage";
import { industries, industriesById, useCasesByKey } from "./data/platform";
import { navigateTo, useHashRoute } from "./router";

function App() {
  const route = useHashRoute();

  let page = <NotFoundPage onNavigate={navigateTo} />;

  if (route.view === "home") {
    page = <HomePage onNavigate={navigateTo} />;
  }

  if (route.view === "review") {
    page = <ReviewIndexPage industries={industries} onNavigate={navigateTo} />;
  }

  if (route.view === "industry") {
    const industry = industriesById[route.industryId];
    page = <IndustryPage industry={industry} onNavigate={navigateTo} />;
  }

  if (route.view === "calculator") {
    const industry = industriesById[route.industryId];
    const calculator = useCasesByKey[`${route.industryId}/${route.useCaseId}`];
    page = (
      <CalculatorPage
        industry={industry}
        calculator={calculator}
        onNavigate={navigateTo}
      />
    );
  }

  return <AppShell>{page}</AppShell>;
}

export default App;
