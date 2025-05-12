package com.sk.plugins;

import com.microsoft.semantickernel.semanticfunctions.annotations.DefineKernelFunction;
import com.microsoft.semantickernel.semanticfunctions.annotations.KernelFunctionParameter;
import com.sk.config.AzureAIConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

@Component
public class GeocodingPlugin {

    private final AzureAIConfig openaibean;
    private final RestTemplate restTemplate;


    @Autowired
    public GeocodingPlugin(AzureAIConfig openaibean, RestTemplate restTemplate) {
        this.openaibean = openaibean;
        this.restTemplate = restTemplate;
    }

    @DefineKernelFunction(description = "Get geographic coordinates for an address.", name = "getCoordinates")
    public String getCoordinates(
            @KernelFunctionParameter(name = "address", description = "The address to geocode") String address) {
        try {
            System.out.println("getCoordinates address-->" + address);
            // Format address better for geocoding
            String formattedAddress = address.replace(" ", "+")
                    .replace(",", "")
                    .trim();

            String urlString = openaibean.getGeourl() + "search?q=" +
                    URLEncoder.encode(formattedAddress, StandardCharsets.UTF_8) +
                    "&format=json" +  // explicitly request JSON format
                    "&api_key=" + openaibean.getGeokey();

            System.out.println("getCoordinates search URL-->" + urlString);

            ResponseEntity<String> response = restTemplate.getForEntity(urlString, String.class);
            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            if (response.getStatusCode() == HttpStatus.OK) {
                if (response.getBody() == null || response.getBody().equals("[]")) {
                    // Try with a simpler version of the address
                    String simplifiedAddress = address.split(",")[0].trim(); // Take only first part of address
                    System.out.println("simplifiedAddress: " + simplifiedAddress);
                    urlString = openaibean.getGeourl() + "search?q=" +
                            URLEncoder.encode(simplifiedAddress, StandardCharsets.UTF_8) +
                            "&format=json" +
                            "&api_key=" + openaibean.getGeokey();
                    Thread.sleep(1000); // Wait for a second before making another request
                    response = restTemplate.getForEntity(urlString, String.class);
                    if (response.getBody() == null || response.getBody().equals("[]")) {
                        return "Error: No results found for address: " + address;
                    }
                }
                return response.getBody();
            } else {
                throw new RuntimeException("HTTP Error: " + response.getStatusCode() +
                        ", Body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Geocoding Error: " + e.getMessage());
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @DefineKernelFunction(description = "Get address for geographic coordinates.", name = "getAddress")
    public String getAddress(
            @KernelFunctionParameter(name = "latitude", description = "The latitude coordinate") double latitude,
            @KernelFunctionParameter(name = "longitude", description = "The longitude coordinate") double longitude) {
        try {

            String urlString = openaibean.getGeourl()+"reverse?lat=" + latitude + "&lon=" + longitude+"&api_key="+openaibean.getGeokey();
            System.out.println("reverse-->"+urlString);
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                throw new RuntimeException("HttpResponseCode: " + responseCode);
            } else {
                StringBuilder inline = new StringBuilder();
                Scanner scanner = new Scanner(url.openStream());
                while (scanner.hasNext()) {
                    inline.append(scanner.nextLine());
                }
                scanner.close();
                return inline.toString();
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }


    }


}