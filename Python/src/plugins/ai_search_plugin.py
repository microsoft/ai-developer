import os
import sys
from typing import TypedDict, Annotated
from semantic_kernel.functions import kernel_function
from semantic_kernel.connectors.azure_ai_search import AzureAISearchCollection
from semantic_kernel.connectors.ai.open_ai import AzureTextEmbedding
from semantic_kernel import Kernel

from models.employee_handbook_model import EmployeeHandbookModel

class AiSearchPlugin:

    def __init__(self, kernel: Kernel):
        # Print environment variables directly in the plugin to verify they're accessible
        print("\n===== AI Search Plugin Environment Variables =====")
        print(f"AZURE_AI_SEARCH_ENDPOINT: {os.environ.get('AZURE_AI_SEARCH_ENDPOINT')}")
        print(f"AZURE_AI_SEARCH_API_KEY: {'*****' if os.environ.get('AZURE_AI_SEARCH_API_KEY') else 'Not found'}")
        print(f"AZURE_AI_SEARCH_INDEX_NAME: {os.environ.get('AZURE_AI_SEARCH_INDEX_NAME')}")
        print(f"AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: {os.environ.get('AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME')}")
        print("=================================================\n")
        
        if not kernel.get_service(type=AzureTextEmbedding):
            raise Exception("Missing AI Foundry embedding service")
        self.client = kernel.get_service(type=AzureTextEmbedding)
        
        # Initialize the AI Search collection using the new API
        print("Initializing AzureAISearchCollection...")
        try:
            self.collection = AzureAISearchCollection(record_type=EmployeeHandbookModel)
            print("✅ AzureAISearchCollection initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize AzureAISearchCollection: {str(e)}")
            raise
        
    """A search plugin that takes the input of a search query, generates the embedding and do the semantic search agains the Azure AI Search vector store."""
    async def generate_vector(self,query: str) :
        try:
            print(f"Generating embedding for query: '{query}'")
            response = await self.client.generate_embeddings([query])
            embedding = response[0]
            print(f"✅ Embedding generated successfully. Dimensions: {len(embedding)}")
            return embedding
        except Exception as e:
            print(f"❌ Failed to generate embedding: {str(e)}")
            raise

    @kernel_function(description="Verify Azure AI Search connection and configuration", name="verify_search_connection")
    async def verify_search_connection(self) -> str:
        """Test connectivity to Azure AI Search service and verify configuration."""
        try:
            # Print all environment variables related to Azure AI Search
            print("\n===== Verifying Azure AI Search Environment Variables =====")
            search_vars = {k: v for k, v in os.environ.items() if 'SEARCH' in k or 'EMBEDDING' in k}
            for k, v in search_vars.items():
                if 'KEY' in k or 'SECRET' in k:
                    print(f"{k}: {'*****' if v else 'Not set'}")
                else:
                    print(f"{k}: {v}")
            print("=================================================\n")
            
            # Check if collection exists
            collection_name = os.environ.get('AZURE_AI_SEARCH_INDEX_NAME', 'employeehandbook')
            print(f"Target collection/index name: {collection_name}")
            
            # Try to verify the collection exists
            try:
                collection_exists = await self.collection.collection_exists()
                print(f"✅ Collection exists: {collection_exists}")
                
                if not collection_exists:
                    return f"""
                    ❌ Collection '{collection_name}' does not exist
                    
                    Check that:
                    1. Your Azure AI Search service is running
                    2. The index named '{collection_name}' exists
                    3. Your environment variables are set correctly:
                       - AZURE_AI_SEARCH_ENDPOINT
                       - AZURE_AI_SEARCH_API_KEY
                       - AZURE_AI_SEARCH_INDEX_NAME
                    """
                
                # Try a simple search operation
                print("Generating test embedding...")
                test_query = "test query about employee handbook"
                test_vector = await self.generate_vector(test_query)
                print(f"✅ Generated test embedding with {len(test_vector)} dimensions")
                
                # Check for results
                print("Executing vector search with test query...")
                search_results = await self.collection.search(
                    vector=test_vector,
                    top=1,
                    include_vectors=False
                )
                
                result_count = 0
                async for result in search_results.results:
                    result_count += 1
                    print(f"Found result: {result.record.title}")
                
                print(f"🔍 Found {result_count} results from test query")
                
                endpoint = os.environ.get('AZURE_AI_SEARCH_ENDPOINT', 'unknown')
                return f"""
                Connection successful:
                - Azure AI Search endpoint: {endpoint}
                - Index name: {collection_name}
                - Collection '{collection_name}' exists and is accessible
                - Generated embedding with {len(test_vector)} dimensions
                - Test search found {result_count} results
                """
            except Exception as collection_error:
                return f"""
                ❌ Could not access collection '{collection_name}'
                Error: {str(collection_error)}
                
                Check that:
                1. Your Azure AI Search service is running
                2. The index named '{collection_name}' exists
                3. Your environment variables are set correctly:
                   - AZURE_AI_SEARCH_ENDPOINT
                   - AZURE_AI_SEARCH_API_KEY
                   - AZURE_AI_SEARCH_INDEX_NAME
                4. The vector field is named 'contentVector' in your index
                """
                
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            return f"❌ Connection test failed: {str(e)}\n\nDetails:\n{error_details}"

    @kernel_function(description="Gets query for Employee handbook data, data consists of mission, values,performance review, workplace safety, workplace violence, Training, Privacy, whistleblower policy and data security, job roles", name="get_employeehandbook_response")
    async def get_employeehandbook_response(self, query_str: Annotated[str, "Query about employee handbook"]) -> Annotated[str, "Response for the query"]:     

        # Generate a vector for your search text.
        print(f"Generating embedding for query: '{query_str}'")
        query_vector = await self.generate_vector(query_str)
        print(f"Generated embedding with {len(query_vector)} dimensions")
        
        # Get the collection name from environment variables or use default
        collection_name = os.environ.get('AZURE_AI_SEARCH_INDEX_NAME', 'employeehandbook')
        print(f"Using collection name: {collection_name}")
        
        print(f"Executing vector search with query: '{query_str}'")
        search_results = await self.collection.search(
            vector=query_vector,
            top=3,
            include_vectors=False
        )

        result_list = []
        count = 0
        async for result in search_results.results:
            count += 1
            result_list.append(result)
            print(
                f"Result {count}: {result.record.parent_id} (with {result.record.title}, score: {result.score})"
            )
            
        if count == 0:
            print("\n⚠️ No results found. Verify your search index configuration.")
            print("Make sure:")
            print("1. The index exists and contains documents")
            print("2. The vector field name 'contentVector' matches your index schema")
            print("3. The vector dimensions match those expected by your index")
            print("4. You have proper permissions to access the index")
            
        return result_list

