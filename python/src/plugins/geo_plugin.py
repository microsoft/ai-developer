from typing import TypedDict, Annotated, Optional  
import requests  
import asyncio  
from semantic_kernel.functions import kernel_function
import os
from dotenv import load_dotenv

load_dotenv(override=True)

class GeoPlugin:  

    @kernel_function(description="Gets the latitude and longitude for a location.")
    async def get_latitude_longitude(self, location:Annotated[str, "The name of the location"]):  
        print(f"lat/long request location: {location}")
        url = f"https://geocode.maps.co/search?q={location}&api_key={os.getenv('GEO_API_KEY')}"  
        response = requests.get(url)  
        print(f"lat/long response {response.json()}")
        return response.json()       
