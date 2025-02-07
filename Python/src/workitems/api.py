from fastapi import FastAPI, HTTPException
import pandas as pd
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import csv
import uvicorn


app = FastAPI(
    title="Work Items API",
    description="API with CRUD operations for workitems data",
    version="1.0.0",
    servers=[
        {"url": "http://localhost:8000", "description": "Local development server"},
    ],
)
class WorkItemsDTO(BaseModel):
    ID: int
    WorkItemType: str
    Title: str
    AssignedTo: str
    State: str
    Tags: str

# Load CSV data into a DataFrame
data = pd.read_csv("data/workitems.csv")

workitems = []
workItemTypes = set()
workItemStates = set()

def load_work_items_from_csv(file_path):
    if os.path.exists(file_path):
        with open(file_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                print(row)
                work_item = WorkItemsDTO(
                    ID=int(row['ID']),
                    WorkItemType=row['WorkItemType'],
                    Title=row['Title'],
                    AssignedTo=row['AssignedTo'],
                    State=row['State'],
                    Tags=row['Tags']
                )
                workitems.append(work_item)
                workItemTypes.add(work_item.WorkItemType)
                workItemStates.add(work_item.State)

load_work_items_from_csv('data/workitems.csv')


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/workitems", response_model=list[WorkItemsDTO])
async def get_all_work_items():
    return workitems

@app.get("/workitems/{id}", response_model=WorkItemsDTO)
async def get_work_item_by_id(id: int):
    work_item = next((item for item in workitems if item.ID == id), None)
    if not work_item:
        raise HTTPException(status_code=404, detail="Work item not found")
    return work_item

@app.post("/workitems", response_model=WorkItemsDTO, status_code=201)
async def create_work_item(new_work_item: WorkItemsDTO):
    workitems.append(new_work_item)
    workItemTypes.add(new_work_item.WorkItemType)
    workItemStates.add(new_work_item.State)
    return new_work_item

@app.put("/workitems/{id}", response_model=WorkItemsDTO)
async def update_work_item(id: int, updated_work_item: WorkItemsDTO):
    work_item = next((item for item in workitems if item.ID == id), None)
    if not work_item:
        raise HTTPException(status_code=404, detail="Work item not found")
    if updated_work_item.WorkItemType:
        work_item.WorkItemType = updated_work_item.WorkItemType
        workItemTypes.add(updated_work_item.WorkItemType)
    if updated_work_item.Title:
        work_item.Title = updated_work_item.Title
    if updated_work_item.AssignedTo:
        work_item.AssignedTo = updated_work_item.AssignedTo
    if updated_work_item.State:
        work_item.State = updated_work_item.State
        workItemStates.add(updated_work_item.State)
    if updated_work_item.Tags:
        work_item.Tags = updated_work_item.Tags
    return work_item

@app.delete("/workitems/{id}", status_code=204)
async def delete_work_item(id: int):
    global workitems
    work_item = next((item for item in workitems if item.ID == id), None)
    if not work_item:
        raise HTTPException(status_code=404, detail="Work item not found")
    workitems = [item for item in workitems if item.ID != id]
    return

@app.get("/workitemtypes", response_model=list[str])
async def get_work_item_types():
    return list(workItemTypes)

@app.get("/workitemstates", response_model=list[str])
async def get_work_item_states():
    return list(workItemStates)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)