from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
import re


def get_styles():
    styles = getSampleStyleSheet()

    custom = {
        "h1": ParagraphStyle(
            "H1",
            fontSize=20,
            fontName="Helvetica-Bold",
            textColor=colors.black,
            spaceAfter=6,
            spaceBefore=10,
            leading=26,
            tracking=1,
        ),
        "h2": ParagraphStyle(
            "H2",
            fontSize=13,
            fontName="Helvetica-Bold",
            textColor=colors.black,
            spaceAfter=4,
            spaceBefore=14,
            leading=18,
            borderPad=4,
        ),
        "h3": ParagraphStyle(
            "H3",
            fontSize=11,
            fontName="Helvetica-Bold",
            textColor=colors.black,
            spaceAfter=3,
            spaceBefore=8,
            leading=16,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            fontSize=10.5,
            fontName="Helvetica",
            leftIndent=15,
            spaceAfter=4,
            leading=17,
        ),
        "sub_bullet": ParagraphStyle(
            "SubBullet",
            fontSize=10,
            fontName="Helvetica-Oblique",
            leftIndent=30,
            textColor=colors.black,
            spaceAfter=3,
            leading=15,
        ),
        "callout": ParagraphStyle(
            "Callout",
            fontSize=10,
            fontName="Helvetica-BoldOblique",
            leftIndent=12,
            rightIndent=12,
            textColor=colors.black,
            backColor=colors.HexColor("#e8e8e8"),
            borderPad=8,
            spaceAfter=8,
            spaceBefore=4,
            leading=16,
        ),
        "normal": ParagraphStyle(
            "Normal",
            fontSize=10.5,
            fontName="Helvetica",
            leading=17,
            spaceAfter=4,
        ),
    }
    return custom


def parse_table(lines, start_idx):
    """Parse markdown table into ReportLab Table."""
    table_lines = []
    i = start_idx
    while i < len(lines) and "|" in lines[i]:
        if "---" not in lines[i]:
            row = [
                Paragraph(
                    md_to_reportlab(cell.strip()), getSampleStyleSheet()["Normal"]
                )
                for cell in lines[i].split("|")
                if cell.strip()
            ]
            table_lines.append(row)
        i += 1

    if not table_lines:
        return None, i

    available_width = 166 * mm
    col_count = len(table_lines[0]) if table_lines else 2
    col_width = available_width / col_count
    table = Table(table_lines, hAlign="LEFT", colWidths=[col_width] * col_count)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.black),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                ("PADDING", (0, 0), (-1, -1), 6),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table, i


def md_to_reportlab(text: str) -> str:
    # Convert **bold** → <b>bold</b>
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    text = re.sub(
        r"\[([^\]]+)\]\((https?://[^\)]+)\)", r'<link href="\2"><u>\1</u></link>', text
    )
    # Convert `code` → <font name="Courier">code</font>
    text = re.sub(r"`(.*?)`", r'<font name="Courier">\1</font>', text)
    text = re.sub(r"^■\s*", "", text)
    return text


def create_pdf(notes: str, filename: str = "outputs/notes.pdf") -> str:
    doc = SimpleDocTemplate(
        filename,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = get_styles()
    content = []
    lines = notes.split("\n")
    i = 0

    while i < len(lines):
        line = lines[i].rstrip()

        if not line:
            content.append(Spacer(1, 5))

        elif line.startswith("# "):
            content.append(Paragraph(md_to_reportlab(line[2:]), styles["h1"]))
            content.append(
                HRFlowable(
                    width="100%",
                    thickness=2,
                    color=colors.black,
                    spaceAfter=8,
                )
            )

        elif line.startswith("## "):
            content.append(Spacer(1, 6))
            content.append(Paragraph(md_to_reportlab(line[3:]), styles["h2"]))
            content.append(
                HRFlowable(
                    width="100%",
                    thickness=0.5,
                    color=colors.HexColor("#cccccc"),
                    spaceAfter=4,
                )
            )

        elif line.startswith("### "):
            content.append(Paragraph(md_to_reportlab(line[4:]), styles["h3"]))

        elif line.startswith("-- "):
            # indented sub-bullet
            content.append(
                Paragraph(
                    f"◦  {md_to_reportlab(line.strip()[3:])}", styles["sub_bullet"]
                )
            )

        elif line.startswith("- "):
            content.append(
                Paragraph(f"•  {md_to_reportlab(line[2:])}", styles["bullet"])
            )

        elif line.startswith("> "):
            content.append(Paragraph(md_to_reportlab(line[2:]), styles["callout"]))

        elif line.startswith("|"):
            # parse full table
            table, i = parse_table(lines, i)
            if table:
                content.append(table)
                content.append(Spacer(1, 8))
            continue

        elif line.strip() == "---":
            content.append(Spacer(1, 6))
            content.append(
                HRFlowable(
                    width="100%",
                    thickness=0.8,
                    color=colors.HexColor("#aaaaaa"),
                    spaceAfter=6,
                )
            )

        elif line.startswith("```"):
            # collect lines until closing ```
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].rstrip().startswith("```"):
                code_lines.append(lines[i].rstrip())
                i += 1
            code_text = "<br/>".join(code_lines) or " "
            content.append(
                Paragraph(
                    f'<font name="Courier">{code_text}</font>',
                    ParagraphStyle(
                        "CodeBlock",
                        fontSize=9,
                        fontName="Courier",
                        padding=8,
                        roundedCorners=8,
                        backColor=colors.HexColor("#f0f0f0"),
                        borderPad=8,
                        leftIndent=12,
                        rightIndent=12,
                        spaceAfter=8,
                        spaceBefore=4,
                        leading=14,
                    ),
                )
            )

        else:
            content.append(Paragraph(md_to_reportlab(line), styles["normal"]))

        i += 1

    doc.build(content)
    return filename
