from pydantic import BaseModel

class ActivityCreate(BaseModel):
    category: str
    description: str
    quantity: float
    unit: str
    emission_factor_id: int


class ActivityOut(BaseModel):
    id: int
    category: str
    description: str
    quantity: float
    unit: str
    total_emision: float
    user_id: int

    class Config:
        orm_mode = True
