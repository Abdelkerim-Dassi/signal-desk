"""The Telegram /learn lesson of the day must rotate through the same lessons,
in the same order, as the web app's Learn page (frontend/src/lib/lessons/*.ts),
or the bot and the app show different lessons on the same day."""

import re
from pathlib import Path

from server import telegram_bot

ROOT = Path(__file__).resolve().parent.parent
LEVEL_FILES = ("basics.ts", "intermediate.ts", "advanced.ts")  # the course order in lessons.ts


def web_lessons() -> list[tuple[str, bool]]:
    """(slug, written?) for every lesson, in course order."""
    out = []
    for name in LEVEL_FILES:
        text = (ROOT / "frontend/src/lib/lessons" / name).read_text(encoding="utf-8")
        # each lesson starts with `  {` then `    slug: '...'` at four spaces
        starts = [(m.group(1), m.start()) for m in re.finditer(r"^    slug: '([^']+)'", text, re.M)]
        for i, (slug, at) in enumerate(starts):
            end = starts[i + 1][1] if i + 1 < len(starts) else len(text)
            body = text[at:end]
            out.append((slug, "\n    sections: [" in body and "\n    quiz: [" in body))
    return out


def test_bot_lessons_match_the_written_web_lessons():
    written = [slug for slug, ready in web_lessons() if ready]
    assert [slug for slug, _ in telegram_bot.LEARN_LESSONS] == written


def test_bot_lesson_titles_are_complete():
    for slug, title in telegram_bot.LEARN_LESSONS:
        assert set(title) == {"en", "fr", "ar"}, slug
        assert all(title.values()), slug
