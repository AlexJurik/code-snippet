import { toJpeg, toPng } from "html-to-image";
import { Code2, Copy, Download, Github, Trash2, Wand2 } from "lucide-react";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";
import { useCallback, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import LANGUAGES_CODES from "./constants/degault-languages-codes";
import LANGUAGES from "./constants/languages";
import THEMES from "./constants/themes";

function App() {
  const [code, setCode] = useState(LANGUAGES_CODES[LANGUAGES.javascript]);
  const [language, setLanguage] = useState(LANGUAGES.javascript);
  const [theme, setTheme] = useState("one-dark");
  const [fontSize, setFontSize] = useState(14);
  const [padding, setPadding] = useState(32);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [borderRadius, setBorderRadius] = useState(8);
  const [windowControls, setWindowControls] = useState(true);
  const [prettifyDisabled, setPrettifyDisabled] = useState(
    language !== LANGUAGES.javascript
  );
  const [imageFormat, setImageFormat] = useState<"png" | "jpeg">("png");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async (type: "png" | "jpeg") => {
    if (!previewRef.current) return;

    const dataUrl =
      type === "png"
        ? await toPng(previewRef.current)
        : await toJpeg(previewRef.current);

    const link = document.createElement("a");
    link.download = `snippet.${type}`;
    link.href = dataUrl;
    link.click();
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!previewRef.current) return;

    const dataUrl =
      imageFormat === "png"
        ? await toPng(previewRef.current)
        : await toJpeg(previewRef.current);

    const blob = await fetch(dataUrl).then((res) => res.blob());
    await navigator.clipboard.write([
      new ClipboardItem({ [`image/${imageFormat}`]: blob }),
    ]);
  }, [imageFormat]);

  const prettifyCode = useCallback(async () => {
    if (prettifyDisabled) return;

    try {
      const parser = "babel";
      const plugins = [prettierPluginBabel, prettierPluginEstree];

      const prettified = await format(code, {
        parser,
        plugins,
        semi: true,
      });

      setCode(prettified);
    } catch (error) {
      console.error("Failed to prettify code:", error);
    }
  }, [code]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const isJs = [LANGUAGES.javascript].includes(value);
    setCode(LANGUAGES_CODES[value]);
    setLanguage(value);
    setPrettifyDisabled(!isJs);
  };

  const currentTheme = THEMES[theme as keyof typeof THEMES];

  return (
    <main className={`min-h-screen flex flex-col ${currentTheme.bg}`}>
      <header className={`border-b ${currentTheme.accent} py-4`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <Code2 className={`w-6 h-6 ${currentTheme.text}`} />
            <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
              Code Snippet
            </h1>
          </div>
        </div>
      </header>

      <section className={`border-b ${currentTheme.accent} py-8`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center gap-4">
            <p
              className={`max-w-2xl ${currentTheme.text} text-sm sm:text-base leading-relaxed`}
            >
              Transform your code into beautiful, shareable images perfect for
              tutorials, documentation, and social media. Customize themes, add
              syntax highlighting, and export with just a click — making your
              code snippets as engaging as your content.
            </p>
            <div
              className={`flex flex-wrap justify-center gap-4 text-sm ${currentTheme.text} opacity-75`}
            >
              <span className="flex items-center gap-1">
                ✨ Multiple Languages
              </span>
              <span className="flex items-center gap-1">🎨 Custom Themes</span>
              <span className="flex items-center gap-1">
                📸 One-Click Export
              </span>
              <span className="flex items-center gap-1">
                🔍 Syntax Highlighting
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-1 flex flex-col" aria-label="Code Editor">
            <div
              className={`rounded-lg ${currentTheme.bg} p-4 shadow-xl border ${currentTheme.accent} h-full flex flex-col`}
            >
              <header className="mb-4 flex items-center justify-between">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>
                  Code Editor
                </h2>
                <div
                  className="flex gap-2"
                  role="toolbar"
                  aria-label="Editor controls"
                >
                  <button
                    onClick={prettifyCode}
                    disabled={prettifyDisabled}
                    className={`p-2 rounded hover:${currentTheme.accent} transition-colors ${
                      prettifyDisabled ? "opacity-50" : ""
                    }`}
                    title="Prettify code"
                    aria-label={
                      prettifyDisabled ? "Prettifying code..." : "Prettify code"
                    }
                  >
                    <Wand2 className={`w-5 h-5 ${currentTheme.text}`} />
                  </button>
                  <button
                    onClick={() => setCode("")}
                    className={`p-2 rounded hover:${currentTheme.accent} transition-colors`}
                    title="Clear code"
                    aria-label="Clear code"
                  >
                    <Trash2 className={`w-5 h-5 ${currentTheme.text}`} />
                  </button>
                </div>
              </header>
              <div
                className={`border ${currentTheme.accent} rounded-lg`}
                role="textbox"
                aria-label="Code input area"
              >
                <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={(code) =>
                    highlight(code, languages[language], language)
                  }
                  padding={16}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: `${fontSize}px`,
                    backgroundColor: "transparent",
                    color: THEMES[theme as keyof typeof THEMES].editorColor,
                    height: "100%",
                    minHeight: "100%",
                  }}
                  className={`w-full h-full ${currentTheme.text}`}
                />
              </div>
            </div>
          </section>

          <section
            className="w-full lg:w-80"
            aria-label="Customization Options"
          >
            <div
              className={`rounded-lg ${currentTheme.bg} p-4 shadow-xl border ${currentTheme.accent} flex flex-col`}
            >
              <header className="mb-4">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>
                  Customize
                </h2>
              </header>
              <form className="space-y-6">
                <fieldset>
                  <legend
                    className={`block text-sm font-medium ${currentTheme.text} mb-1`}
                  >
                    Language
                  </legend>
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className={`w-full rounded-md ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.accent} p-2 h-10`}
                    aria-label="Select programming language"
                  >
                    {Object.entries(LANGUAGES).map(([key, name]) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset>
                  <legend
                    className={`block text-sm font-medium ${currentTheme.text} mb-1`}
                  >
                    Theme
                  </legend>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={`w-full rounded-md ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.accent} p-2 h-10`}
                    aria-label="Select theme"
                  >
                    {Object.keys(THEMES).map((themeName) => (
                      <option key={themeName} value={themeName}>
                        {themeName
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset className="flex flex-col">
                  <legend
                    className={`block text-sm font-medium ${currentTheme.text} mb-1`}
                  >
                    Font Size
                  </legend>
                  <input
                    type="number"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className={`w-full rounded-md ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.accent} p-2 h-10`}
                    aria-label="Adjust font size"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <legend
                    className={`block text-sm font-medium ${currentTheme.text} mb-1`}
                  >
                    Padding
                  </legend>
                  <input
                    type="number"
                    min="16"
                    max="64"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className={`w-full rounded-md ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.accent} p-2 h-10`}
                    aria-label="Adjust padding"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <legend
                    className={`block text-sm font-medium ${currentTheme.text} mb-1`}
                  >
                    Border Radius
                  </legend>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className={`w-full rounded-md ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.accent} p-2 h-10`}
                    aria-label="Adjust border radius"
                  />
                </fieldset>

                <fieldset>
                  <legend
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Display Options
                  </legend>
                  <div className="space-y-3">
                    <div className="flex items-center h-10 px-2 rounded-md hover:bg-gray-800/10">
                      <input
                        type="checkbox"
                        id="lineNumbers"
                        checked={showLineNumbers}
                        onChange={(e) => setShowLineNumbers(e.target.checked)}
                        className="rounded w-4 h-4"
                      />
                      <label
                        htmlFor="lineNumbers"
                        className={`text-sm ${currentTheme.text} ml-3 flex-grow`}
                      >
                        Line numbers
                      </label>
                    </div>
                    <div className="flex items-center h-10 px-2 rounded-md hover:bg-gray-800/10">
                      <input
                        type="checkbox"
                        id="windowControls"
                        checked={windowControls}
                        onChange={(e) => setWindowControls(e.target.checked)}
                        className="rounded w-4 h-4"
                      />
                      <label
                        htmlFor="windowControls"
                        className={`text-sm ${currentTheme.text} ml-3 flex-grow`}
                      >
                        Window controls
                      </label>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </section>

          <section className="flex-1 flex flex-col" aria-label="Code Preview">
            <div
              className={`rounded-lg ${currentTheme.bg} p-4 shadow-xl border ${currentTheme.accent} h-full flex flex-col`}
            >
              <header className="mb-4 flex items-center justify-between flex-shrink-0">
                <h2 className={`text-xl font-bold ${currentTheme.text}`}>
                  Preview
                </h2>
                <div
                  className="flex items-center gap-2"
                  role="toolbar"
                  aria-label="Preview controls"
                >
                  <select
                    value={imageFormat}
                    onChange={(e) =>
                      setImageFormat(e.target.value as "png" | "jpeg")
                    }
                    className={`h-10 rounded-md ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.accent} px-2 text-sm`}
                    aria-label="Select image format"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                  <button
                    onClick={() => handleExport(imageFormat)}
                    className={`p-2 rounded hover:${currentTheme.accent} transition-colors`}
                    title={`Download as ${imageFormat.toUpperCase()}`}
                    aria-label={`Download as ${imageFormat.toUpperCase()}`}
                  >
                    <Download className={`w-5 h-5 ${currentTheme.text}`} />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`p-2 rounded hover:${currentTheme.accent} transition-colors`}
                    title="Copy to clipboard"
                    aria-label="Copy to clipboard"
                  >
                    <Copy className={`w-5 h-5 ${currentTheme.text}`} />
                  </button>
                </div>
              </header>
              <div
                ref={previewRef}
                className={`rounded-lg border ${currentTheme.bg} ${currentTheme.accent} overflow-hidden`}
                style={{ borderRadius: `${borderRadius}px` }}
                role="img"
                aria-label="Code preview"
              >
                {windowControls && (
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-inherit">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                )}
                <div
                  className="overflow-auto"
                  style={{
                    padding: `${padding}px`,
                  }}
                >
                  <pre
                    className={`${currentTheme.text} w-fit min-w-full`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {showLineNumbers ? (
                      <code
                        className="table w-full"
                        dangerouslySetInnerHTML={{
                          __html: code
                            .split("\n")
                            .map(
                              (line, i) => `
                              <div class="table-row">
                                <span class="table-cell select-none text-gray-500 pr-4 text-right w-12">${
                                  i + 1
                                }</span>
                                <span class="table-cell whitespace-pre">${highlight(
                                  line,
                                  languages[language],
                                  language
                                )}</span>
                              </div>
                            `
                            )
                            .join(""),
                        }}
                      />
                    ) : (
                      <code
                        dangerouslySetInnerHTML={{
                          __html: highlight(
                            code,
                            languages[language],
                            language
                          ),
                        }}
                      />
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className={`border-t ${currentTheme.accent} py-4 mt-auto`}>
        <div className="container mx-auto px-4 flex justify-center gap-4">
          <a
            href="https://github.com/yourusername/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 ${currentTheme.text} hover:opacity-80 transition-opacity`}
            aria-label="View source code on GitHub"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </main>
  );
}

export default App;
