import os
from typing import Coroutine, Union

from ...core.main import ContextItem, ContextItemDescription, ContextItemId, Step
from ...core.observation import Observation
from ...core.sdk import ContinueSDK
from ...libs.chroma.query import ChromaIndexManager
from ..context_providers.util import remove_meilisearch_disallowed_chars
from .chat import SimpleChatStep
from .core.core import EditFileStep


class CreateCodebaseIndexChroma(Step):
    name: str = "Create Codebase Index"
    hide: bool = True
    description: str = "Generating codebase embeddings..."

    async def describe(self, models) -> Coroutine[str, None, None]:
        return "Generated codebase embeddings"

    async def run(self, sdk: ContinueSDK) -> Coroutine[Observation, None, None]:
        index = ChromaIndexManager(sdk.ide.workspace_directory)
        if not index.check_index_exists():
            self.hide = False

        await index.create_codebase_index(sdk)


class AnswerQuestionChroma(Step):
    user_input: str
    _answer: Union[str, None] = None
    name: str = "Answer Question"

    n: int = 4

    hide: bool = True

    async def describe(self, llm) -> Coroutine[str, None, None]:
        if self._answer is None:
            return f"Answering the question: {self.user_input}"
        else:
            return self._answer

    async def run(self, sdk: ContinueSDK) -> Coroutine[Observation, None, None]:
        index = ChromaIndexManager(sdk.ide.workspace_directory)
        results = index.query_codebase_index(self.user_input, n=self.n)

        for i in range(len(results["ids"][0])):
            filepath = results["ids"][0][i]
            await sdk.add_context_item(
                ContextItem(
                    content=results["documents"][0][i],
                    description=ContextItemDescription(
                        name=os.path.basename(filepath),
                        description=filepath,
                        id=ContextItemId(
                            provider_title="file",
                            item_id=remove_meilisearch_disallowed_chars(filepath),
                        ),
                    ),
                )
            )

        files = []
        for node in results.source_nodes:
            resource_name = list(node.node.relationships.values())[0]
            filepath = resource_name[: resource_name.index("::")]
            files.append(filepath)
            code_snippets += f"""{filepath}```\n{node.node.text}\n```\n\n"""

        prompt = dedent(
            f"""Here are a few snippets of code that might be useful in answering the question:

            {code_snippets}

            Here is the question to answer:

            {self.question}

            Here is the answer:"""
        )

        answer = await sdk.models.summarize.complete(prompt)
        # Make paths relative to the workspace directory
        answer = answer.replace(await sdk.ide.getWorkspaceDirectory(), "")

        self._answer = answer

        await sdk.ide.setFileOpen(files[0])


class EditFileChroma(Step):
    user_input: str
    hide: bool = True

    async def run(self, sdk: ContinueSDK) -> Coroutine[Observation, None, None]:
        index = ChromaIndexManager(sdk.ide.workspace_directory)
        results = index.query_codebase_index(self.user_input)

        resource_name = list(results.source_nodes[0].node.relationships.values())[0]
        filepath = resource_name[: resource_name.index("::")]

        await sdk.run_step(
            EditFileStep(
                filepath=filepath,
                prompt=f"Here is the code:\n\n{{code}}\n\nHere is the user request:\n\n{self.user_input}\n\nHere is the code after making the requested changes:\n",
            )
        )
