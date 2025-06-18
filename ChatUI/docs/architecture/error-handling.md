# Loading and Error Handling System

This diagram covers the triggers for loading/error states, the UI indicators used, and the error handling mechanisms.

## Loading/Error State Triggers & UI

```mermaid
%%{init: {'theme':'dark'}}%%
flowchart TD
    subgraph Triggers["Loading Triggers"]
        SendMsg[Send Message]
        FetchHistory[Load Chat History]
        SwitchChat[Switch Chat]
        SwitchMode[Switch Agent Mode]
    end
    
    subgraph States["Loading & Error States"]
        Loading[Loading State]
        Error[Error State]
    end
    
    subgraph UI_Indicators["UI Indicators"]
        Spinners[Loading Spinners]
        Disabled[Disabled Inputs]
        Messages[Status Messages]
        Animations[Loading Animations]
        ErrorDisplay[Error Messages]
        RetryOptions[Retry Options]
    end
    
    subgraph Handling["Error Handling"]
        Catch[Try/Catch Blocks]
        Log[Error Logging]
        Fallback[Fallback Content]
        Recovery[Recovery Actions]
    end
    
    Triggers -->|Activates| States
    States -->|Controls| UI_Indicators
    Error -->|Triggers| Handling
    
    SendMsg -->|Sets| Loading
    FetchHistory -->|Sets| Loading
    SwitchChat -->|Sets| Loading
    SwitchMode -->|Sets| Loading
    
    Loading -->|Shows| Spinners
    Loading -->|Enables| Disabled
    Loading -->|Displays| Messages
    Loading -->|Triggers| Animations
    
    Error -->|Shows| ErrorDisplay
    Error -->|Offers| RetryOptions
    
    Catch -->|Captures| Error
    Log -->|Records| Error
    Fallback -->|Displays when| Error
    Recovery -->|Attempts after| Error
    
    style Triggers fill:#1565c0,stroke:#0d47a1,color:#ffffff
    style States fill:#6a1b9a,stroke:#4a148c,color:#ffffff
    style UI_Indicators fill:#e65100,stroke:#bf360c,color:#ffffff
    style Handling fill:#2e7d32,stroke:#1b5e20,color:#ffffff
    
    linkStyle default stroke:#88ccff,stroke-width:2px
```

## Frontend Error Handling Flow

This diagram details the flow of handling errors originating from API service calls within the frontend context.

```mermaid
graph TD
    A1[API Service: fetch]
    A2[Check Response]
    A3[Parse JSON]
    A4[Extract Data]
    A5[Return Message]
    
    E1[HTTP Error]
    E2[Parse Error]
    E3[Data Error]
    E4[Timeout]
    E5[Network Error]
    
    C1[Context: send]
    C2[Try/Catch]
    C3[Show Error]
    C4[Reset Loading]

    C1-->A1
    A1-->A2
    A2-->A3
    A2-->E1
    A3-->A4
    A3-->E2
    A4-->A5
    A4-->E3
    A1-->E4
    A1-->E5
    
    E1-->C2
    E2-->C2
    E3-->C2
    E4-->C2
    E5-->C2
    
    A5-->C2
    C2-->C3
    C2-->C4
    C3-->C4
``` 