<<<<<<< HEAD
=======
import asyncio
>>>>>>> fd8436e7 (Refactor helper (#481))
from typing import Optional

import typer

<<<<<<< HEAD
from . import run
=======
from .headless import start_headless_session
>>>>>>> fd8436e7 (Refactor helper (#481))
from .server.main import run_server

app = typer.Typer()


@app.command()
def main(
    port: int = typer.Option(65432, help="server port"),
    host: str = typer.Option("127.0.0.1", help="server host"),
    config: Optional[str] = typer.Option(
        None, help="The path to the configuration file"
    ),
    headless: bool = typer.Option(False, help="Run in headless mode"),
):
    if headless:
<<<<<<< HEAD
        run(config)
=======
        loop = asyncio.get_event_loop()
        loop.run_until_complete(start_headless_session(config=config))
        tasks = asyncio.all_tasks(loop)
        loop.run_until_complete(asyncio.gather(*tasks))
>>>>>>> fd8436e7 (Refactor helper (#481))
    else:
        run_server(port=port, host=host)


if __name__ == "__main__":
    app()
