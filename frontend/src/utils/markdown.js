export function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^-- (.+)$/gm, '<li class="sub-bullet">$1</li>')
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" style="color:var(--accent)">$1</a>',
    )
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row
        .split("|")
        .map((c) => `<td>${c.trim()}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (m) => {
      const rows = m.trim().split("\n");
      const head = `<thead><tr>${rows[0].replace(/<\/?tr>/g, "")}</tr></thead>`;
      const body = rows
        .slice(1)
        .filter((r) => !r.includes("---"))
        .join("");
      return `<table>${head}<tbody>${body}</tbody></table>`;
    })
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|b|p|h|a|t])/gm, "")
    .trim();
}
