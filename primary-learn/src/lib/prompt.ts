/** Split a prompt that has a sequence after the question, e.g. "What comes next? 1, 2, 3, …". */
export function splitPromptTail(prompt: string): { head: string; tail: string | null } {
  const at = prompt.indexOf("? ");
  if (at < 0) return { head: prompt, tail: null };
  const tail = prompt.slice(at + 2).trim();
  if (!tail) return { head: prompt, tail: null };
  return { head: prompt.slice(0, at + 1), tail };
}
