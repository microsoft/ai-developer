package com.sk.plugins;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.ClientOptions;
import com.azure.core.util.MetricsOptions;
import com.azure.core.util.TracingOptions;
import com.azure.search.documents.indexes.SearchIndexAsyncClient;
import com.azure.search.documents.indexes.SearchIndexClientBuilder;
import com.microsoft.semantickernel.aiservices.openai.textembedding.OpenAITextEmbeddingGenerationService;
import com.microsoft.semantickernel.data.azureaisearch.AzureAISearchVectorStore;
import com.microsoft.semantickernel.data.vectorsearch.VectorSearchResult;
import com.microsoft.semantickernel.data.azureaisearch.AzureAISearchVectorStoreRecordCollectionOptions;
import com.microsoft.semantickernel.data.vectorstorage.VectorStoreRecordCollection;
import com.microsoft.semantickernel.semanticfunctions.annotations.DefineKernelFunction;
import com.microsoft.semantickernel.semanticfunctions.annotations.KernelFunctionParameter;
import com.microsoft.semantickernel.services.textembedding.Embedding;
import com.sk.config.AzureAIConfig;
import com.sk.kernel.kernelUtil;
import com.sk.model.Handbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.Duration;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Component
public class AISearchPlugin {


    private final AzureAIConfig config;
    private final com.sk.kernel.kernelUtil kernelUtil;

    @Autowired
    public AISearchPlugin(AzureAIConfig openaibean, kernelUtil kernelUtil) {
        this.config = openaibean;
        this.kernelUtil = kernelUtil;
    }

    @DefineKernelFunction(description = "Search documents for employer Customer Portal \n" +
            "Basics Complete \n" +
            "Training", name = "search")
    public String contoso_search(
            @KernelFunctionParameter(name = "query", description = "The users optimized semantic search query") String inputString) {
        if (inputString == null || inputString.trim().isEmpty()) {
            return "Error: Search query cannot be empty";
        }
        System.out.println("Searching for: " + inputString);
        try {
            // Create embedding service
            OpenAITextEmbeddingGenerationService embeddingService = createEmbeddingService();

            // Create search client and vector store
            AzureAISearchVectorStore vectorStore = createVectorStore();

            // Get collection
            VectorStoreRecordCollection<String, Handbook> collection = vectorStore.getCollection(
                config.getAzure_search_indexname(),
                AzureAISearchVectorStoreRecordCollectionOptions.<Handbook>builder()
                    .withRecordClass(Handbook.class)
                    .build()
            );

            // Generate embeddings
            List<Embedding> embeddings = embeddingService
                .generateEmbeddingsAsync(Collections.singletonList(inputString))
                .timeout(Duration.ofSeconds(30))
                .block();

            if (embeddings == null || embeddings.isEmpty()) {
                return "Error: Failed to generate embeddings";
            }

            // Perform vector search
            var searchResults = collection
            .searchAsync(embeddings.get(0).getVector(), null)
            .timeout(Duration.ofSeconds(30))
            .block();

            if (searchResults == null || searchResults.getTotalCount() == 0) {
            return "No matching results found";
        }

            // Get best match - results are already sorted by score            
            return searchResults.getResults().get(0).getRecord().getChunk();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    private OpenAITextEmbeddingGenerationService createEmbeddingService() throws IOException, IOException {
        return OpenAITextEmbeddingGenerationService.builder()
            .withOpenAIAsyncClient(kernelUtil.openAIAsyncClient())
            .withDeploymentName(config.getEmbeddingDeploymentName())
            .withModelId(config.getEmbeddingDeploymentName())
            .withDimensions(1536)
            .build();
    }

    private AzureAISearchVectorStore createVectorStore() {
        SearchIndexAsyncClient searchClient = new SearchIndexClientBuilder()
            .endpoint(config.getAzure_search_Endpoint())
            .credential(new AzureKeyCredential(config.getAzure_search_key()))
            .clientOptions(new ClientOptions()
                .setApplicationId("SemanticKernel-Basics"))
            .buildAsyncClient();

        return AzureAISearchVectorStore.builder()
            .withSearchIndexAsyncClient(searchClient)
            .withOptions(new AzureAISearchVectorStoreOptions())
            .build();
    }
}
