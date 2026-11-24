import http.server
import socketserver
import os
import sys

DIRECTORY = r"c:\Projetos\Melissa Ferreira\site"
PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}", flush=True)

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with ThreadedTCPServer(("", PORT), Handler) as httpd:
        print(f"Server serving at http://localhost:{PORT} and http://127.0.0.1:{PORT}", flush=True)
        httpd.serve_forever()
