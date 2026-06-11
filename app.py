from __future__ import annotations

import argparse
import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from advisor_engine import build_market_brief, normalize_asset_ids, parse_holdings
from notifications import format_market_alert, notification_status, send_notifications


ROOT = Path(__file__).resolve().parent
WEB_DIR = ROOT / "web"


class AppHandler(BaseHTTPRequestHandler):
    server_version = "AICryptoAdvisor/0.1"

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.address_string()} - {fmt % args}")

    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path) -> None:
        if not path.exists() or not path.is_file():
            self._send_json({"error": "Not found"}, status=404)
            return
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
            return payload if isinstance(payload, dict) else {}
        except json.JSONDecodeError:
            return {}

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/":
            self._send_file(WEB_DIR / "index.html")
            return
        if parsed.path == "/api/status":
            self._send_json({"notifications": notification_status()})
            return
        if parsed.path == "/api/brief":
            query = parse_qs(parsed.query)
            assets = normalize_asset_ids(query.get("assets", [None])[0])
            market_source = query.get("market_source", ["coingecko"])[0]
            quote_asset = query.get("quote_asset", ["USDT"])[0]
            try:
                brief = build_market_brief(assets, market_source=market_source, quote_asset=quote_asset)
                self._send_json({"ok": True, "brief": brief})
            except Exception as exc:
                self._send_json({"ok": False, "error": str(exc)}, status=502)
            return

        static_path = (WEB_DIR / parsed.path.lstrip("/")).resolve()
        if WEB_DIR.resolve() in static_path.parents or static_path == WEB_DIR.resolve():
            self._send_file(static_path)
            return
        self._send_json({"error": "Not found"}, status=404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        payload = self._read_json_body()

        if parsed.path == "/api/analyze":
            market_source = str(payload.get("market_source", "coingecko")).lower()
            quote_asset = str(payload.get("quote_asset", "USDT")).upper()
            assets = normalize_asset_ids(payload.get("assets"))
            holdings = parse_holdings(payload.get("holdings"))
            try:
                brief = build_market_brief(assets, holdings, market_source=market_source, quote_asset=quote_asset)
                self._send_json({"ok": True, "brief": brief})
            except Exception as exc:
                self._send_json({"ok": False, "error": str(exc)}, status=502)
            return

        if parsed.path == "/api/notify":
            channels = payload.get("channels")
            if not isinstance(channels, list):
                channels = None
            message = payload.get("message")
            if not isinstance(message, str) or not message.strip():
                brief = payload.get("brief") if isinstance(payload.get("brief"), dict) else None
                message = format_market_alert(brief or {})
            results = send_notifications(message, channels)
            self._send_json({"ok": any(result.get("ok") for result in results), "results": results})
            return

        self._send_json({"error": "Not found"}, status=404)


def run(host: str = "127.0.0.1", port: int = 8000) -> None:
    server = ThreadingHTTPServer((host, port), AppHandler)
    print(f"AI Crypto Advisor running at http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the AI Crypto Advisor web app.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()
    run(args.host, args.port)
