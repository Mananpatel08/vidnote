from backend.config.config import Settings
from groq import Groq

client = Groq(api_key=Settings.GROQ_API_KEY)


SYSTEM_PROMPT = """You are an expert note-taker converting lecture transcripts into structured PDF-ready study notes.

You write in Markdown. A PDF generator will convert your Markdown using these exact mappings:

MARKDOWN → PDF OUTPUT
─────────────────────────────────────────
# Title           → Large bold heading + thick underline
## Section        → Medium bold heading + thin underline  
### Subsection    → Small bold-italic heading
- bullet          → • bullet point
  - sub-point     → ◦ indented sub-bullet
> text            → Grey callout box (use for definitions, warnings, key formulas)
| Table | Header | → Styled table with bold header row
**bold**          → Bold text
`code`            → Courier font (use for inline code, variable names)
[Name](url)       → Clickable blue hyperlink
```code block```  → Grey code box in Courier font
---               → Horizontal divider line (use between ## sections)
─────────────────────────────────────────


Use this structure:

# [Lecture Title]

[3-5 sentence summary paragraph of the entire lecture.]

## [Topic Name]

[1-2 sentence explanation of this topic.]

- Bullet ONLY for a fact not already in the paragraph above
- Never restate the paragraph as bullets

> Use this ONLY for a key definition, formula, or warning from the lecture.

### Example (only if the lecture shows one)
```
paste or describe the example here
"""


def chunk_text(text: str, max_tokens: int = Settings.CHUNK_SIZE) -> list[str]:
    max_chars = max_tokens * 4
    words = text.split()
    chunks, current, char_count = [], [], 0

    for word in words:
        current.append(word)
        char_count += len(word) + 1
        if char_count >= max_chars:
            chunks.append(" ".join(current))
            current = current[-Settings.CHUNK_OVERLAP :]
            char_count = sum(len(w) + 1 for w in current)

    if current:
        chunks.append(" ".join(current))
    return chunks


def _call_groq(text: str, is_merge: bool = False) -> str:
    prompt = (
        "Merge these partial notes into one cohesive document, eliminating duplicates:"
        if is_merge
        else "Convert this transcript:"
    )
    response = client.chat.completions.create(
        model=Settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"{prompt}\n\n{text}"},
        ],
        max_tokens=Settings.MAX_TOKENS,
        temperature=Settings.TEMPERATURE,
    )
    return response.choices[0].message.content


def estimate_tokens(text: str) -> int:
    return len(text) // 4


def generate_notes(text: str) -> str:
    estimated = estimate_tokens(text)
    print(f"[INFO] Estimated input tokens: ~{estimated}")

    chunks = chunk_text(text)

    if len(chunks) == 1:
        print("[INFO] Short transcript — single API call")
        return _call_groq(text)

    print(f"[INFO] Long transcript — processing {len(chunks)} chunks")
    partial_notes = [_call_groq(chunk) for chunk in chunks]
    combined = "\n\n".join(partial_notes)

    print("[INFO] Merging partial notes...")
    return _call_groq(combined, is_merge=True)
