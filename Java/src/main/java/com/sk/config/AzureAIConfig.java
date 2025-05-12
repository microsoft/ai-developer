package com.sk.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
public class AzureAIConfig {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${spring.ai.azure.openai.api-key}")
    private String openAiApiKey;

    @Value("${spring.ai.azure.openai.endpoint}")
    private String openAiEndpoint;

    @Value("${spring.ai.azure.openai.chat.deployment-name}")
    private String chatDeploymentName;

    @Value("${client.geo.url}")
    private String geourl;


    @Value("${client.geo.key}")
    private String geokey;

    @Value("${client.weather.url}")
    private String weatherurl;


    @Value("${client.azure.search.endpoint}")
    private String azure_search_Endpoint;

    @Value("${client.azure.search.adminkey}")
    private String azure_search_key;

    @Value("${client.azure.search.index}")
    private String azure_search_indexname;

    @Value("${client.azure.search.embedding.deployment}")
    private String embeddingDeploymentName;

    public String getEmbeddingDeploymentName() {
        return embeddingDeploymentName;
    }

    public void setEmbeddingDeploymentName(String embeddingDeploymentName) {
        this.embeddingDeploymentName = embeddingDeploymentName;
    }

    public String getAzure_search_Endpoint() {
        return azure_search_Endpoint;
    }

    public void setAzure_search_Endpoint(String azure_search_Endpoint) {
        this.azure_search_Endpoint = azure_search_Endpoint;
    }

    public String getAzure_search_key() {
        return azure_search_key;
    }

    public void setAzure_search_key(String azure_search_key) {
        this.azure_search_key = azure_search_key;
    }

    public String getAzure_search_indexname() {
        return azure_search_indexname;
    }

    public void setAzure_search_indexname(String azure_search_indexname) {
        this.azure_search_indexname = azure_search_indexname;
    }

    public String getWeatherurl() {
        return weatherurl;
    }

    public void setWeatherurl(String weatherurl) {
        this.weatherurl = weatherurl;
    }

    public String getGeourl() {
        return geourl;
    }

    public void setGeourl(String geourl) {
        this.geourl = geourl;
    }

    public String getGeokey() {
        return geokey;
    }

    public void setGeokey(String geokey) {
        this.geokey = geokey;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getOpenAiApiKey() {
        return openAiApiKey;
    }

    public void setOpenAiApiKey(String openAiApiKey) {
        this.openAiApiKey = openAiApiKey;
    }

    public String getOpenAiEndpoint() {
        return openAiEndpoint;
    }

    public void setOpenAiEndpoint(String openAiEndpoint) {
        this.openAiEndpoint = openAiEndpoint;
    }

    public String getChatDeploymentName() {
        return chatDeploymentName;
    }

    public void setChatDeploymentName(String chatDeploymentName) {
        this.chatDeploymentName = chatDeploymentName;
    }

}

