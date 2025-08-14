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
    <div className="space-y-2">
      <div className="p-4 border border-main lg:border-none bg-gray-800 text-white rounded-lg overflow-auto">
        <ReactMarkdown>{description}</ReactMarkdown>
        <SyntaxHighlighter language={language} style={dracula}>
          {code}
        </SyntaxHighlighter>
      </div>
      <button
        id="generate"
        // disabled={selectedFiles.current.size === 0 || loading}
        // onClick={handleGenerateTest}
        className="btn w-full disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-400 disabled:bg-none cursor-pointer active:scale-98 transition-transform bg-gradient-to-br from-[#FF7E5F] via-[#FEB47B] to-[#9333EA]
    bg-[length:_200%_200%]
    animate-gradient-bg flex gap-2 items-center justify-center text-black text-sm px-5 py-2.5 rounded-lg shadow font-semibold hover:border-blue-500"
      >
        {/* {loading && (
          <img src="/spinner.svg" className="animate-spin w-5 h-5" alt="" />
        )} */}
        <p>Request PR</p>
      </button>
    </div>
  );
}
