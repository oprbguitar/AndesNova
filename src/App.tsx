import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { FloatingChatbot } from "./components/FloatingChatbot";
import { HomeView } from "./components/HomeView";
import { RouteView } from "./components/RouteView";
import { companyData } from "./data/companyData";
import { validateCompanyData } from "./utils/validateCompanyData";

type View = "Inicio" | "Ruta";

export default function App() {
  const data = useMemo(() => validateCompanyData(companyData), []);
  const [activeView, setActiveView] = useState<View>(() =>
    window.location.hash.toLowerCase().includes("ruta") ? "Ruta" : "Inicio",
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>();
  const selectedArea = data.areas.find((area) => area.id === selectedAreaId);

  function navigate(view: View) {
    setActiveView(view);
    setSelectedAreaId(undefined);
    window.history.replaceState(null, "", view === "Ruta" ? "#ruta" : "#inicio");
  }

  useEffect(() => {
    function syncHash() {
      setActiveView(window.location.hash.toLowerCase().includes("ruta") ? "Ruta" : "Inicio");
      setSelectedAreaId(undefined);
    }

    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <main className="page-shell">
      <div className="app-card">
        <Header
          activeView={activeView}
          onNavigate={navigate}
          companyName={data.companyName}
          navigation={data.navigation}
        />
        <AnimatePresence mode="wait">
          {activeView === "Inicio" ? (
            <HomeView
              key="home"
              areas={data.areas}
              kpis={data.kpis}
              selectedArea={selectedArea}
              onSelectArea={setSelectedAreaId}
              onRoute={() => navigate("Ruta")}
            />
          ) : (
            <RouteView
              key="route"
              areas={data.areas}
              routeSteps={data.routeSteps}
              assistant={data.assistant}
              selectedArea={selectedArea}
              onSelectArea={setSelectedAreaId}
            />
          )}
        </AnimatePresence>
      </div>
      <FloatingChatbot />
    </main>
  );
}
