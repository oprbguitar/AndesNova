import { ArrowLeft, ArrowRight, Check, Download, Mail, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  buildDiagnosisText,
  collectNextSteps,
  collectPriorityRisks,
  collectRecommendations,
  companySizes,
  computeAreaResult,
  evaluationAreas,
  evaluationOptions,
  sectors,
  type GeneralData,
} from "../data/evaluation";

type EvaluationWizardProps = {
  open: boolean;
  onClose: () => void;
  onRequestContact: (summary: string) => void;
};

const stepLabels = [
  "Datos generales",
  "Documentación",
  "Procesos y operación",
  "Riesgos",
  "Clientes y objetivos",
  "Resultado preliminar",
];

const emptyGeneral: GeneralData = { company: "", sector: "", size: "" };

export function EvaluationWizard({ open, onClose, onRequestContact }: EvaluationWizardProps) {
  const [step, setStep] = useState(0);
  const [general, setGeneral] = useState<GeneralData>(emptyGeneral);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      setStep(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const results = useMemo(
    () => evaluationAreas.map((area) => computeAreaResult(area, answers)),
    [answers],
  );
  const risks = useMemo(() => collectPriorityRisks(answers), [answers]);
  const recommendations = useMemo(() => collectRecommendations(results), [results]);
  const nextSteps = useMemo(() => collectNextSteps(results), [results]);
  const diagnosisText = useMemo(
    () => buildDiagnosisText(general, results, risks, recommendations, nextSteps),
    [general, results, risks, recommendations, nextSteps],
  );

  const currentArea = step >= 1 && step <= 4 ? evaluationAreas[step - 1] : undefined;

  const stepComplete =
    step === 0
      ? general.company.trim().length > 1 && Boolean(general.sector) && Boolean(general.size)
      : currentArea
        ? currentArea.questions.every((question) => answers[question.id] !== undefined)
        : true;

  const downloadDiagnosis = () => {
    const blob = new Blob([diagnosisText + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagnostico-andesnova-${general.company.trim().toLowerCase().replace(/\s+/g, "-") || "empresa"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="contact-modal wizard-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Evaluación preliminar AndesNova"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="contact-close" type="button" aria-label="Cerrar" onClick={onClose}>
              <X size={20} />
            </button>

            <header className="wizard-header">
              <span className="wizard-eyebrow">Evaluación preliminar</span>
              <h2>{stepLabels[step]}</h2>
              <div className="wizard-progress" aria-label={`Paso ${step + 1} de ${stepLabels.length}`}>
                {stepLabels.map((label, index) => (
                  <span
                    key={label}
                    className={`wizard-dot ${index === step ? "active" : ""} ${index < step ? "done" : ""}`}
                  />
                ))}
                <small>
                  Paso {step + 1} de {stepLabels.length}
                </small>
              </div>
            </header>

            {step === 0 ? (
              <div className="wizard-body">
                <label className="wizard-field">
                  <span>Nombre de la empresa</span>
                  <input
                    value={general.company}
                    onChange={(event) => setGeneral((c) => ({ ...c, company: event.target.value }))}
                    placeholder="Ej. Comercial Los Andes S.A.C."
                  />
                </label>
                <label className="wizard-field">
                  <span>Sector</span>
                  <select
                    value={general.sector}
                    onChange={(event) => setGeneral((c) => ({ ...c, sector: event.target.value }))}
                  >
                    <option value="">Selecciona un sector</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="wizard-field">
                  <span>Tamaño de la empresa</span>
                  <div className="wizard-choice-row">
                    {companySizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`wizard-choice ${general.size === size ? "selected" : ""}`}
                        onClick={() => setGeneral((c) => ({ ...c, size }))}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {currentArea ? (
              <div className="wizard-body">
                {currentArea.questions.map((question) => (
                  <div className="wizard-question" key={question.id}>
                    <p>{question.text}</p>
                    <div className="wizard-choice-row">
                      {evaluationOptions.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          className={`wizard-choice ${answers[question.id] === option.score ? "selected" : ""}`}
                          onClick={() =>
                            setAnswers((current) => ({ ...current, [question.id]: option.score }))
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {step === 5 ? (
              <div className="wizard-body wizard-result">
                <section aria-label="Nivel por área">
                  <h3>Nivel por área</h3>
                  {results.map((result) => (
                    <div className="wizard-level-row" key={result.id}>
                      <span className="wizard-level-title">{result.title}</span>
                      <span className="wizard-level-bar" aria-hidden="true">
                        <span
                          style={{
                            width: `${(result.score / result.maxScore) * 100}%`,
                            background: result.levelColor,
                          }}
                        />
                      </span>
                      <span className="status-pill" style={{ "--node-color": result.levelColor } as never}>
                        {result.level}
                      </span>
                    </div>
                  ))}
                </section>

                <section aria-label="Riesgos prioritarios">
                  <h3>Riesgos prioritarios</h3>
                  {risks.length ? (
                    <ol>
                      {risks.map((risk) => (
                        <li key={risk}>{risk}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="wizard-ok">
                      <Check size={15} /> Sin riesgos prioritarios detectados: buen nivel de control general.
                    </p>
                  )}
                </section>

                <section aria-label="Recomendaciones">
                  <h3>Recomendaciones</h3>
                  <ul>
                    {recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section aria-label="Próximos pasos">
                  <h3>Próximos pasos</h3>
                  <ol>
                    {nextSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </section>

                <div className="wizard-result-actions">
                  <button className="primary-action wizard-cta" type="button" onClick={() => onRequestContact(diagnosisText)}>
                    Solicitar contacto con este diagnóstico <Mail size={18} />
                  </button>
                  <button className="contact-copy" type="button" onClick={downloadDiagnosis}>
                    Descargar resumen <Download size={16} />
                  </button>
                </div>
                <p className="wizard-disclaimer">
                  Diagnóstico preliminar de orientación: no constituye una conclusión legal ni financiera definitiva.
                </p>
              </div>
            ) : null}

            {step < 5 ? (
              <footer className="wizard-nav">
                <button
                  className="wizard-back"
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0}
                >
                  <ArrowLeft size={17} /> Atrás
                </button>
                <button
                  className="primary-action wizard-next"
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!stepComplete}
                >
                  {step === 4 ? "Ver resultado" : "Siguiente"} <ArrowRight size={18} />
                </button>
              </footer>
            ) : (
              <footer className="wizard-nav">
                <button className="wizard-back" type="button" onClick={() => setStep(4)}>
                  <ArrowLeft size={17} /> Revisar respuestas
                </button>
              </footer>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
