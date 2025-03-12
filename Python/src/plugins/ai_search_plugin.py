import os
from typing import TypedDict, Annotated
from semantic_kernel.functions import kernel_function
from semantic_kernel.connectors.memory.azure_ai_search import AzureAISearchCollection, AzureAISearchStore
from semantic_kernel.data.vector_search import VectorSearchOptions
from semantic_kernel import Kernel

from models.employee_handbook_model import EmployeeHandbookModel

class AiSearchPlugin:

    def __init__(self, kernel: Kernel):
        if not kernel.get_service("embedding"):
            raise Exception("Missing AI Foundry embedding service")
        self.client = kernel.get_service("embedding")

    """A search plugin that takes the input of a search query, generates the embedding and do the semantic search agains the Azure AI Search vector store."""
    async def generate_vector(self,query: str) :
                response = await self.client.generate_embeddings([query])
                return response[0]

    @kernel_function(description="Gets query for Employee handbook data, data consists of mission, values,performance review, workplace safety, workplace violence, Training, Privacy, whistleblower policy and data security, job roles", name="get_employeehandbook_response")
    async def get_employeehandbook_response(self, query_str: Annotated[str, "Query about employee handbook"]) -> Annotated[str, "Response for the query"]:     

        # Generate a vector for your search text.
        # Just showing a placeholder method here for brevity.
        query_vector = await self.generate_vector(query_str)
        # query_vector = query_vector.embedding

         # Create a Azure AI Search VectorStore object and choose an existing collection that already contains records.
        store = AzureAISearchStore(
            api_key=os.getenv("AZURE_AI_SEARCH_KEY"),
            search_endpoint=os.getenv("AZURE_AI_SEARCH_ENDPOINT")
        )       
        
        collection: AzureAISearchCollection = store.get_collection(collection_name="employeehandbook",data_model_type=EmployeeHandbookModel)

        search_results = await collection.vectorized_search(
            vector=query_vector, options=VectorSearchOptions(vector_field_name="contentVector",top=2))

        result_list = []
        async for result in search_results.results:
            result_list.append(result)
            print(
                f"    {result.record.parent_id} (with {result.record.title}, and content: {result.record.content})"
            )
        return result_list

