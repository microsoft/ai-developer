package com.sk.plugins;

import com.microsoft.semantickernel.semanticfunctions.annotations.DefineKernelFunction;
import com.microsoft.semantickernel.semanticfunctions.annotations.KernelFunctionParameter;


import java.time.LocalDate;

public class DateTimePlugin {



    @DefineKernelFunction(description = "Get the current date", name = "getCurrentDate")
    public String getCurrentDate() {
        try {
            System.out.println("-----getCurrentDate----->"+LocalDate.now().toString());
            return LocalDate.now().toString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @DefineKernelFunction(description = "Get the current time", name = "getCurrentTime")
    public String getCurrentTime() {
        try {
            System.out.println("-----getCurrentTime----->"+java.time.LocalTime.now().toString());
            //Return the current time in local time zone
            return java.time.LocalTime.now().toString();

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @DefineKernelFunction(description = "Get the year from a given date", name = "getYear")
    public String getYear(
            @KernelFunctionParameter(name = "date", description = "The date in YYYY-MM-DD format") String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            System.out.println("-----getYear-----> " + localDate.getYear());
            return String.valueOf(localDate.getYear());
        } catch (Exception e) {
            return "Error: Please provide date in YYYY-MM-DD format";
        }
    }

    @DefineKernelFunction(description = "Get the month from a given date", name = "getMonth")
    public String getMonth(
            @KernelFunctionParameter(name = "date", description = "The date in YYYY-MM-DD format") String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            String month = localDate.getMonth().toString();
            System.out.println("-----getMonth-----> " + month);
            return month;
        } catch (Exception e) {
            return "Error: Please provide date in YYYY-MM-DD format";
        }
    }

    @DefineKernelFunction(description = "Get the day of week from a given date", name = "getDayOfWeek")
    public String getDayOfWeek(
            @KernelFunctionParameter(name = "date", description = "The date in YYYY-MM-DD format") String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            String dayOfWeek = localDate.getDayOfWeek().toString();
            System.out.println("-----getDayOfWeek-----> " + dayOfWeek);
            return dayOfWeek;
        } catch (Exception e) {
            return "Error: Please provide date in YYYY-MM-DD format";
        }
    }

}