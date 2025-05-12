package com.sk.plugins;

import com.microsoft.semantickernel.semanticfunctions.annotations.DefineKernelFunction;
import com.microsoft.semantickernel.semanticfunctions.annotations.KernelFunctionParameter;
import com.sk.config.AzureAIConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@Component
public class WeatherPlugin {

    private final AzureAIConfig config;

    private final RestTemplate restTemplate;

    @Autowired
    public WeatherPlugin(AzureAIConfig config, RestTemplate restTemplate) {
        this.config = config;
        this.restTemplate = restTemplate;
    }


    @DefineKernelFunction(description = "Gets the forecast for a given latitude, longitude and number of days. Can forecast up to 16 days in the future.", name = "getWeather")
    public String getWeather(
            @KernelFunctionParameter(name = "latitude", description = "The latitude coordinate") double latitude,
            @KernelFunctionParameter(name = "longitude", description = "The longitude coordinate") double longitude,
            @KernelFunctionParameter(name = "days", description = "Number of days") int days) {
        try {
            if (days <= 0 || days > 16)
            {
                return "Day count is out of bounds. Days should be between 1 and 16";
            }
            String urlString =  config.getWeatherurl()+"?latitude="+latitude+"&longitude="+longitude+"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,uv_index&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days="+days;
            System.out.println("getWeather URL--> "+urlString);
            ResponseEntity<String> response = restTemplate.getForEntity(urlString, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }


    @DefineKernelFunction(description = "Gets the weather details for recent previous weather at a given location. This can go a number of days up to 3 months into the past.", name = "get_weather_recent")
    public String get_weather_recent(float latitude, float longitude, int daysInPast)
    {

        String urlString =  config.getWeatherurl()+"?latitude="+latitude+"&longitude="+longitude+"&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&past_days="+daysInPast;
        System.out.println("get_weather_recent URL--> "+urlString);
        ResponseEntity<String> response = restTemplate.getForEntity(urlString, String.class);
        return response.getBody();
    }


}