import React, { createContext, useContext, useState } from "react";

export type SpeciesAnalysisType = {
  id: string;
  imageUri: string;
  analysis: {
    common_name: string;
    scientific_name: string;
    family?: string;
    genus?: string;
    score?: number;
    [key: string]: any;
  };
  location: { latitude: number; longitude: number };
  timestamp: string;
};

type SpeciesAnalysisContextType = {
  analyses: SpeciesAnalysisType[];
  addAnalysis: (analysis: SpeciesAnalysisType) => void;
};

const SpeciesAnalysisContext = createContext<SpeciesAnalysisContextType | undefined>(undefined);

export const SpeciesAnalysisProvider = ({ children }: { children: React.ReactNode }) => {
  const [analyses, setAnalyses] = useState<SpeciesAnalysisType[]>([]);

  const addAnalysis = (analysis: SpeciesAnalysisType) => {
    setAnalyses((prev) => [...prev, analysis]);
  };

  return (
    <SpeciesAnalysisContext.Provider value={{ analyses, addAnalysis }}>
      {children}
    </SpeciesAnalysisContext.Provider>
  );
};

export const useSpeciesAnalysis = () => {
  const context = useContext(SpeciesAnalysisContext);
  if (!context) throw new Error("useSpeciesAnalysis must be used within a SpeciesAnalysisProvider");
  return context;
};