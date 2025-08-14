import { useTestSuite } from "@/context/TestSuite";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function GeneratedTest() {
  const { testSuite } = useTestSuite();

  if (!testSuite) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-400">No test generated yet.</p>
      </div>
    );
  }

  if ("error" in testSuite) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">{testSuite.error}</p>
      </div>
    );
  }

  const { description, test_suite } = testSuite.test_response;
  const { language, code } = test_suite;

  return (
    <div className="p-4 border-amber-500 bg-gray-800 text-white rounded-lg overflow-auto">
      <ReactMarkdown>{description}</ReactMarkdown>
      <SyntaxHighlighter language={language} style={dracula}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
