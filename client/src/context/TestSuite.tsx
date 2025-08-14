import { createContext, useContext, useState } from "react";

type TestSuite =
  | {
      _id: string;
      repo: string;
      filePaths: string[];
      test_response: {
        description: string;
        test_suite: {
          language: string;
          framework: string;
          code: string;
        };
      };
    }
  | {
      error: string;
    };

interface TestSuiteContext {
  testSuite: TestSuite | null;
  setTestSuite: (testSuite: TestSuite) => void;
}

export const testSuiteContext = createContext<TestSuiteContext>({
  testSuite: null,
  setTestSuite: () => {},
});

const TestSuiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);

  return (
    <testSuiteContext.Provider value={{ testSuite, setTestSuite }}>
      {children}
    </testSuiteContext.Provider>
  );
};

export default TestSuiteProvider;

export const useTestSuite = () => useContext(testSuiteContext);
