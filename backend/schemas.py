from pydantic import BaseModel, constr

class MovieCreate(BaseModel):
    searchTerm: constr(min_length=1, max_length=1024)
    count: int = 1
    poster_url: constr(min_length=1, max_length=2024)
    movie_id: int

class MovieRead(BaseModel):
    movie_id: int
    searchTerm: str
    count: int
    poster_url: str

    class Config:
        orm_mode = True