package com.sk.client;

import com.sk.model.WorkItemsDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public class WorkItemsClient {
    private final String apiBaseUrl;
    private final RestTemplate restTemplate;

    public WorkItemsClient(RestTemplate restTemplate, String baseUrl) {
        this.restTemplate = restTemplate;
        this.apiBaseUrl = baseUrl;
    }

    public List<WorkItemsDTO> getAllWorkItems() {
        ResponseEntity<List<WorkItemsDTO>> response = restTemplate.exchange(
                apiBaseUrl + "/workitems",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<WorkItemsDTO>>() {}
        );
        return response.getBody();
    }

    public List<WorkItemsDTO> getMyWorkItems() {
        ResponseEntity<List<WorkItemsDTO>> response = restTemplate.exchange(
                apiBaseUrl + "/myworkitems",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<WorkItemsDTO>>() {}
        );
        return response.getBody();
    }

    public WorkItemsDTO getWorkItemById(int id) {
        return restTemplate.getForObject(apiBaseUrl + "/workitems/" + id, WorkItemsDTO.class);
    }

    public List<String> getWorkItemTypes() {
        ResponseEntity<List<String>> response = restTemplate.exchange(
                apiBaseUrl + "/workitemtypes",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<String>>() {}
        );
        return response.getBody();
    }
} 