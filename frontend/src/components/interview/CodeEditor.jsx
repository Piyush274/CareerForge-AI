import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { FiTerminal, FiX, FiCopy, FiCheck, FiPlay, FiCornerDownLeft, FiMaximize2 } from 'react-icons/fi'
import { FaCode } from 'react-icons/fa'
import Editor from '@monaco-editor/react'

const LANG_OPTIONS = [
  { id: "javascript", label: "JavaScript (ES6)", ext: "solution.js" },
  { id: "python", label: "Python 3", ext: "solution.py" },
  { id: "java", label: "Java 17", ext: "Solution.java" },
  { id: "cpp", label: "C++ 20", ext: "solution.cpp" }
];

const DEFAULT_CODE = {
  javascript: `// Write your algorithmic solution below
function solution(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  python: `# Write your algorithmic solution below
def solution(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  java: `// Write your algorithmic solution below
import java.util.*;

public class Solution {
    public int[] solution(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  cpp: `// Write your algorithmic solution below
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
};

function CodeEditor({ onClose, onSubmitCode }) {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE["javascript"]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleInsert = () => {
    onSubmitCode?.(code);
    onClose?.();
  };

  const currentLangObj = LANG_OPTIONS.find(l => l.id === lang) || LANG_OPTIONS[0];

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 z-50 bg-black/70 backdrop-blur-md'
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className='fixed inset-x-3 top-4 bottom-4 sm:inset-x-8 sm:top-6 sm:bottom-6 md:inset-x-16 md:top-8 md:bottom-8 z-50 flex flex-col overflow-hidden rounded-2xl bg-[#090C15] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)]'
        >
          {/* Header Bar */}
          <div className='relative flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0D111D] border-b border-white/8'>
            
            {/* Breadcrumb File Info */}
            <div className='flex items-center gap-2.5'>
              <div className='w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
                <FaCode size={13} />
              </div>
              <div className='flex items-center gap-1.5 font-mono text-xs'>
                <span className='text-slate-500'>workspace /</span>
                <span className='text-white font-medium'>{currentLangObj.ext}</span>
              </div>
            </div>

            {/* Language Selector Pills */}
            <div className='hidden sm:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5'>
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLang(l.id);
                    setCode(DEFAULT_CODE[l.id]);
                  }}
                  className={`text-xs px-3 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                    lang === l.id
                      ? "bg-indigo-600 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.id}
                </button>
              ))}
            </div>

            {/* Utility Actions */}
            <div className='flex items-center gap-2'>
              <button
                onClick={handleCopy}
                className='p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                title="Copy code"
              >
                {copied ? <FiCheck size={16} className='text-emerald-400' /> : <FiCopy size={16} />}
              </button>

              <button
                onClick={onClose}
                className='p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                title="Close editor"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Monaco Code Editor Canvas */}
          <div className='relative flex-1 min-h-0 bg-[#090C15]'>
            <Editor
              height="100%"
              language={lang}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                fontSize: 13.5,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 14, bottom: 14 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                smoothScrolling: true,
                automaticLayout: true
              }}
            />
          </div>

          {/* Footer Action Bar */}
          <div className='relative border-t border-white/8 px-4 sm:px-6 py-3 bg-[#0D111D] flex items-center justify-between'>
            <div className='flex items-center gap-2 text-[11px] font-mono text-slate-500'>
              <span className='w-2 h-2 rounded-full bg-emerald-400' />
              <span>Monaco Language Service Ready</span>
            </div>

            <div className='flex items-center gap-3'>
              <button
                onClick={onClose}
                className='px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
              >
                Cancel
              </button>

              <button
                onClick={handleInsert}
                className='flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer'
              >
                <span>Append to Answer</span>
                <FiCornerDownLeft size={13} />
              </button>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default CodeEditor
